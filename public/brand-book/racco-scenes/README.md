# Racco — service scenes

Character variations derived from the approved `racco-self-avatar.png` identity.
Generated with imagegen; transparent PNG originals. Keep the round brown otter,
cream cheeks, dark square glasses and gray hoodie consistent across expressions.

- `thinking.png`: thoughtful, paw under chin — service introduction.
- `pointing.png`: attentive guide — homepage service entry and CRM story.
- `presenting.png`: presents a blank paper — communication and Web experience story.
- `welcoming.png`: small wave — people story and consultation invitation.

The existing `racco-self-avatar.png` remains the source for the calm otter at the
clear desk in the AI story. Each service has its own before/change/after drawings
in `WorkStory.tsx`; these portraits are parts of those scenes.

Serve these through responsive Next Image to avoid sending full-resolution
originals to small diagram placements. Do not flatten transparency or apply a
multiply blend to the new cutouts.
