# Writes art/prompts/<name>.txt and art/logs/jobs.txt ("name|ref,ref") for the full asset batch.
# Run from the repo root: python3 art/prompts_full.py && art/run_jobs.sh art/logs/jobs.txt 6
import os
G = ("Photographed straight-on and isolated on a perfectly flat, evenly lit pure chroma-key green background (#00B140), "
     "no shadow on the background{sep}. Warm lamp light on the object only. Real handmade paper craft, same materials, colours and "
     "photographic look as the reference images. No text, no letters, no watermark.")
def green(multi=False):
    return G.format(sep=", every object clearly separated from the others with wide green gaps between them" if multi else "")
M = "art/raw/ref_mouse.png"
C = "art/raw/ref_charlie.png"
B = "art/raw/plate_bakery_back2.png"
D = "art/raw/plate_desk_top.png"
CRUDE = "the crude paper mouse from the reference (leftmost one: jagged hand-cut edges, cream lined notebook paper with faint pencil scribbles, black crayon dot eyes of different sizes, small red paper heart on its chest, curly thread tail)"
NEAT = "the neat paper mouse from the reference (middle one: clean cuts, cream lined notebook paper with faint pencil scribbles, black dot eyes, small red paper heart on its chest, small blank paper name tag tied with white cotton thread around its neck, curly thread tail)"
LACE = "the exquisitely intricate paper mouse from the reference (rightmost one: laser-fine lace-like filigree cut-work body, red heart, name tag, curly thread tail)"
CH = "the flat kraft-paper puppet man from the reference (round head, messy pencil-drawn hair, black dot eyes, small pencil smile, white paper baker's apron, brass split-pin joints, bare paper feet)"
jobs = {
 # ---------- plates ----------
 "s02_pov2": ("Point-of-view shot of a tiny flat paper mouse lying on a sheet of lined notebook paper, looking straight up for the very first time: a huge, soft, out-of-focus warm desk-lamp glow fills the upper left, a dark warm room ceiling, creamy bokeh discs; in the right foreground the enormous blurred tip of a black wax crayon hovering close above, pointing down toward the viewer; the blurry edge of the notebook page in the bottom foreground. Absolutely NO people, no face, no hands, no body parts. Extremely shallow depth of field, warm amber and deep brown, gentle film grain, dreamy, a first awakening. No text.", [D]),
 "plate_sky_back": ("Flat paper-cut toy-theatre BACKDROP photographed straight-on, filling the whole frame: a wide, open daytime sky made of layered hand-cut blue papers (pale blue at the bottom to deeper blue at the top), soft torn-paper horizon of distant hills at the very bottom, a few small flat cut-paper clouds glued on, faint pencil marks, subtle paper fibre texture, gentle warm light. Feeling of a sky bigger than the world. No objects in front, no text.", [B]),
 "s04_night": ("A night scene on a handmade paper toy-theatre stage: the same paper bakery as the reference backdrop but at night, deep blue paper sky in the cut-out window, a cut-paper crescent moon and small paper stars hanging on white threads; in the lower left corner " + CH + " is asleep, lying on a folded paper blanket on a pile of flour sacks, eyes drawn closed; " + CRUDE + " curled up beside his pillow, also asleep. Soft moonlight blue with a little warm lamp glow from the left, quiet and dreamy, real paper craft photographed, shallow depth of field. No text.", [C, M, B]),
 "plate_graph": ("Perfectly top-down flat photograph (camera directly above) of a single sheet of slightly yellowed laboratory graph paper filling the entire frame edge to edge: fine pale green-grey square grid with every fifth line a little darker, subtle paper fibre texture, a faint coffee ring in one corner, soft warm desk-lamp light from the upper left falling off toward the lower right. Completely blank: no drawings, no objects, no text.", []),
 "plate_roots": ("Low-angle macro photograph at ground level among the giant roots of a huge intricate laser-cut paper tree (the same paper tree as the reference): thick roots cut from cream notebook paper with fine lace-like filigree, covered in tiny pencil formulas and musical notes, curving and branching across a wooden desk like the corridors of a maze, leading into the distance; warm golden lamp light glowing through the filigree, deep blue night shadows, floating dust, shallow depth of field. No animals, no people, no text.", ["art/raw/s17_tree.png"]),
 "s16_sleep": ("Recreate this exact same photograph, same camera, same composition, same lighting and same objects, but WITHOUT the paper tree: nothing grows from the sleeping puppet's head; above him is only the dark blue night with a few paper stars on threads, the window and the desk lamp. Keep the sleeping kraft-paper puppet, the books and the sleeping paper mouse exactly where they are.", ["art/raw/s17_tree.png"]),
 "plate_city_sky": ("Flat paper-cut toy-theatre BACKDROP photographed straight-on, filling the whole frame: a cold, pale blue-grey evening sky made of layered papers, a thin pale paper moon, faint pencil lines, very sparse and lonely. No buildings, no objects, no text.", [B]),
 "plate_rain_window": ("Photograph of a rain-streaked window at grey dusk seen from a desk: raindrops running down the glass, a blurred grey-blue city outside, cold diffuse light, the edge of a worn wooden desk at the bottom of the frame with a few scattered sheets of graph paper. Melancholic, desaturated, shallow depth of field. No people, no text.", ["art/raw/s25_tower.png"]),
 "plate_box": ("Three-quarter top-down photograph of a small open handmade box made of kraft card, lined inside with a folded sheet of cream lined notebook paper, sitting empty on an old dark wooden desk at night; dim, fading warm lamp light from the upper left, cold blue shadows creeping in, a few paper scraps and a pencil stub nearby. Quiet, tender, sad. No people, no animals, no text.", [D]),
 "plate_backyard": ("A handmade paper toy-theatre stage of a small city BACKYARD in soft morning light, photographed straight-on: a simple, clumsily hand-cut paper tree with torn edges and big rough cut-paper leaves in the centre, beneath it a small low mound of brown paper earth (empty, nothing on it), a little paper picket fence, a brick wall of kraft paper behind with a back door, pale paper sky. Sunlight falls through holes in the cut leaves. Crude, warm, gentle, real paper craft photographed, shallow depth of field. No people, no animals, no text.", [B]),
 "plate_lamp_base": ("Low eye-level macro photograph on a desk at night, right at the base of a brass desk lamp with a green glass shade: a warm golden pool of light on the edge of an open lined notebook, a pencil lying across the page, deep cosy shadows around, soft bokeh. Empty space in the centre of the frame for a small figure. No people, no animals, no text.", [D, "art/raw/ref_desk.png"]),
 "plate_bakery_crude": ("The same paper bakery backdrop as the reference, but rebuilt by a clumsy hand: everything torn rather than cut, rough ripped edges, wobbly crooked shapes, slightly misaligned layers, simple crayon-coloured window with a big round orange paper sun, a few lopsided paper loaves on one crooked shelf, the lower third plain empty kraft paper. Warm gentle morning light. Flat toy-theatre backdrop photographed straight-on filling the frame. No text.", [B]),
 # ---------- cut-outs ----------
 "cut_mouse_flat": ("The crude paper mouse from the reference, but WITHOUT eyes and WITHOUT the heart (blank face, plain chest), lying completely flat like a cut-out shape, photographed from directly above, side-profile silhouette facing right, jagged hand-cut edges, cream lined notebook paper with faint pencil scribbles, curly thread tail. " + green(), [M]),
 "cut_hearts": ("Three small hearts cut from red construction paper with slightly uneven scissor edges, lying flat, photographed from directly above. " + green(True), [M]),
 "cut_hand_scissors": ("Seen from directly above: the fingertips of a baker's right hand (only the thumb, index and middle fingertips, a little flour dust) holding small silver paper scissors that point toward the lower left, entering the frame from the right edge; no wrist, no arm, no other body parts. " + green(), [C]),
 "cut_hand_crayon": ("Seen from directly above: the fingertips of a baker's right hand (only thumb, index and middle fingertips, a little flour dust) holding a short black wax crayon whose tip points toward the lower left, entering the frame from the right edge; no wrist, no arm. " + green(), [C]),
 "cut_hand_pencil": ("Seen from directly above: the fingertips of a baker's right hand (only thumb, index and middle fingertips, a little flour dust) holding a short worn yellow pencil whose sharpened tip points toward the lower left, entering the frame from the right edge; no wrist, no arm. " + green(), [C]),
 "cut_mouse_crude_stand": ("" + CRUDE + ", standing upright on its hind feet, three-quarter front view facing right, curious, full body. " + green(), [M]),
 "cut_clouds": ("Three soft fluffy clouds hand-cut from white and very pale blue paper with slightly torn edges, each hanging from a short white thread at its top, flat paper props. " + green(True), [B]),
 "cut_stars": ("Five small paper stars cut from pale yellow and cream paper and one small paper crescent moon, each hanging from a short white thread at its top, flat paper props. " + green(True), [B]),
 "cut_mouse_top": ("" + NEAT + " seen from DIRECTLY ABOVE (top view) running on all fours, head pointing right, flat paper craft. " + green(), [M]),
 "cut_tag": ("A small blank rectangular paper name tag with a clipped corner and a reinforced hole, a loose loop of white cotton thread through the hole, made of cream notebook paper with faint blue lines, lying flat, photographed from directly above. Completely blank, no writing. " + green(), [M]),
 "cut_mouse_neat_nopaws": ("" + NEAT + ", standing upright, three-quarter front view facing right, but WITHOUT any front paws or arms (smooth body sides where the arms would be). " + green(), [M]),
 "cut_paws": ("Two tiny paper mouse front paws (little arms with four small fingers each), cut from cream lined notebook paper, mirror images of each other, flat paper props. " + green(True), [M]),
 "cut_crumb": ("One small bread crumb made of crumpled kraft and cream paper, a tiny paper-craft prop. " + green(), [B]),
 "cut_waves": ("A long horizontal strip of hand-cut paper ocean waves for a toy theatre: layered blue and teal papers with curling white paper crests, wide panoramic shape, flat stage prop. " + green(), [B]),
 "cut_sand": ("A long horizontal strip of hand-cut sand-coloured paper beach dunes with a few tiny paper shells and a small paper starfish, flat toy-theatre stage prop, wide panoramic shape. " + green(), [B]),
 "cut_charlie_read": ("" + CH + ", sitting cross-legged and reading an open little paper book held in both hands, three-quarter view facing left, absorbed and happy. " + green(), [C]),
 "cut_birds": ("Three small birds folded from old book pages (tiny printed text texture, illegible), wings spread wide in flight, different poses, flat paper props. " + green(True), [C]),
 "cut_charlie_back": ("" + CH + ", seen from BEHIND, standing and looking toward the distance; on his right shoulder sits the small neat paper mouse from the reference, raising both tiny paws toward the horizon. Full body. " + green(), [C, M]),
 "cut_sun_stick": ("A round paper sun made of layered orange and yellow hand-cut paper rays, glued onto a thin wooden stick, a toy-theatre prop. " + green(), [B]),
 "cut_mouse_sit_neat": ("" + NEAT + ", sitting on its haunches, side view facing right, calm. " + green(), [M]),
 "cut_mouse_yawn": ("" + NEAT + ", sitting on its haunches, side view facing right, doing a huge sleepy yawn: mouth wide open (a small pink paper mouth), eyes squeezed shut drawn as little curved pencil lines, tiny paws stretched up. " + green(), [M]),
 "cut_mouse_curl_neat": ("" + NEAT + ", curled up into a little ball fast asleep, eyes drawn closed as curved pencil lines, tail wrapped around, side view. " + green(), [M]),
 "cut_mouse_walk_lace": ("" + LACE + ", walking on all fours, side view facing right, mid-stride. " + green(), [M]),
 "cut_charlie_walk": ("" + CH + ", walking briskly forward in side view facing right, one leg forward, arms swinging, carrying a small paper book under one arm, head held high. Full body. " + green(), [C]),
 "cut_mouse_run": ("" + NEAT + ", running fast on all fours, side view facing right, ears back. " + green(), [M]),
 "cut_alice": ("A slender woman cut from cream paper as a flat silhouette puppet, 1960s dress and short bob hair, standing in side view facing left, gently looking away, kind and a little sad; simple pencil details. Full body. " + green(), [C]),
 "cut_city1": ("A long horizontal strip of far-away city skyline cut from cold blue-grey paper: tall skyscrapers and water towers in flat silhouette, tiny cut-out lit windows, toy-theatre background layer, wide panoramic shape. " + green(), [B]),
 "cut_city2": ("A long horizontal strip of 1960s New York brownstone buildings with fire escapes cut from cold slate-blue paper, small cut windows, flat toy-theatre middle layer, wide panoramic shape. " + green(), [B]),
 "cut_city3": ("A long horizontal strip of a street foreground cut from dark blue-grey paper: street lamps, a mailbox, a fire hydrant, a bench, low railings, flat toy-theatre front layer, wide panoramic shape. " + green(), [B]),
 "cut_mouse_curl_crude": ("" + CRUDE + ", but WITHOUT eyes (blank face), curled up lying down into a small ball, tail wrapped around, side view, jagged hand-cut edges. " + green(), [M]),
 "cut_box_lid": ("The lid of a small handmade box made of kraft card, seen from directly above, slightly worn corners. " + green(), [D]),
 "cut_coworkers": ("Two paper puppet bakers cut from kraft paper in the same style as the reference puppet: one tall and thin, one short and round, white paper baker's caps and aprons, brass split-pin joints, dot eyes, both smiling kindly and waving, full bodies side by side. " + green(True), [C]),
 "cut_charlie_run": ("" + CH + ", running joyfully in side view facing right, BAREFOOT, one leg stretched far forward, arms swinging, leaning forward. Full body. " + green(), [C]),
 "cut_flowers": ("Four small clumsy hand-made paper flowers, each with torn-paper petals and a green paper stem: one white, one pale yellow, one pink, one pale blue, flat paper props lying side by side. " + green(True), [M]),
 "cut_petals": ("Six single torn-paper flower petals (white notebook paper with faint blue lines, rough ripped edges) and one small round yellow paper flower centre, lying flat, seen from above. " + green(True), [M]),
 "cut_leaves": ("Eight small leaves cut from cream notebook paper, each covered in tiny pencil formulas or musical notes (illegible), slightly curled, lying flat, various sizes. " + green(True), ["art/raw/s17_tree.png"]),
 "cut_scraps": ("Eight small torn scraps of damp grey notebook paper and book pages with ragged edges, various shapes, lying flat. " + green(True), ["art/raw/s25_tower.png"]),
}
os.makedirs("art/prompts", exist_ok=True)
os.makedirs("art/logs", exist_ok=True)
with open("art/logs/jobs.txt", "w") as jf:
    for name, (prompt, refs) in jobs.items():
        open(f"art/prompts/{name}.txt", "w").write(prompt + "\n")
        if os.path.exists(f"art/raw/{name}.png"):
            continue
        jf.write(name + "|" + ",".join(refs) + "\n")
print(len(jobs), "prompts")
