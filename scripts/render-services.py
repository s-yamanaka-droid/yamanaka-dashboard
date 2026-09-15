"""Original Lakkan sculpture: separate frames aligned into a single passage."""
import bpy, math, os
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'public', 'services')
os.makedirs(out, exist_ok=True)

def material(name, color, metallic=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = .28
    return m

chalk = material('Mineral sage', (.47, .59, .54), .22)
red = material('Lakkan vermillion', (.57, .075, .045), .3)
paper = material('Studio paper', (.72, .77, .71))
sculpture = []
for i in range(3):
    # Architectural frames; bevel catches the studio light.
    for location, scale in [((-1.12, i*1.15-1.15, 1.4),(.22,.24,1.4)),
                            ((1.12, i*1.15-1.15, 1.4),(.22,.24,1.4)),
                            ((0, i*1.15-1.15, 2.65),(1.12,.24,.15))]:
        bpy.ops.mesh.primitive_cube_add(size=2, location=location)
        obj = bpy.context.object
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        bevel = obj.modifiers.new('Soft architectural edges', 'BEVEL')
        bevel.width = .15
        bevel.segments = 6
        obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
        obj.data.materials.append(chalk)
        sculpture.append(obj)
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=.53, location=(.05,-1.7,.65))
sphere = bpy.context.object
sphere.data.materials.append(red)
bpy.ops.object.shade_smooth()
sculpture.append(sphere)
bpy.ops.object.select_all(action='DESELECT')
for obj in sculpture: obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'passage.glb'), use_selection=True, export_apply=True)
bpy.ops.mesh.primitive_plane_add(size=200)
bpy.context.object.data.materials.append(paper)
bpy.ops.object.camera_add(location=(6,-9,6.5))
cam = bpy.context.object
cam.rotation_euler = (Vector((0,0,1.2))-cam.location).to_track_quat('-Z','Y').to_euler()
cam.data.type='ORTHO'
cam.data.ortho_scale=7.2
bpy.context.scene.camera=cam
for pos, energy, size in [((1,-3,8),1700,5),((-5,-1,4),800,4)]:
    bpy.ops.object.light_add(type='AREA', location=pos)
    light=bpy.context.object
    light.data.energy=energy
    light.data.shape='DISK'
    light.data.size=size
    light.rotation_euler=(Vector((0,0,1))-light.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.render.resolution_x=1200
scene.render.resolution_y=1200
scene.render.resolution_percentage=100
scene.world.color=(.3,.3,.3)
scene.render.image_settings.file_format='PNG'
scene.render.filepath=os.path.join(out,'passage.png')
source_dir = os.path.join(root, 'design', 'services')
os.makedirs(source_dir, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(source_dir,'passage.blend'))
bpy.ops.render.render(write_still=True)
