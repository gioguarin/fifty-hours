# Motif Specifications

## 1. `timeline`
- **Slot:** `[data-motif="timeline"]`
- **What it shows:** The arc of the project on a horizontal axis, marking the prequel (Nov 4) versus the session itself (Nov 5 to Nov 7).
- **Animation:** Sequential reveal of timeline nodes. Each node fades in, scaling its text slightly. Lasts ~1.5 seconds.
- **Final static frame:** All 6 nodes visible with dates and times. A bracket marks the "~24h Session" vs the prequel.
- **Dependencies:** Uses host variables `--accent`, `--surface`, `--muted`, `--rule`.

## 2. `pipeline`
- **Slot:** `[data-motif="pipeline"]`
- **What it shows:** The benchmark flow from Tasks/Models → LM Studio → LLM Judge → Code → Report. 
- **Animation:** An animated count process where "particles" flow along the paths between steps. The final counter ticks up to 154. Lasts ~3.5 seconds.
- **Final static frame:** All boxes visible. The report box text reads "154 rows fully processed".
- **Dependencies:** Uses host variables `--accent`, `--surface`, `--muted`, `--rule`.

## 3. `calibration`
- **Slot:** `[data-motif="calibration"]`
- **What it shows:** The drop in "capability difference" when going from a single sample to three samples, revealing that the +0.12 diff is within the noise interval (which crosses the 0 line).
- **Animation:** Reveals the first point (+0.62), draws a dashed line, then reveals the second point (+0.12). The error bar extends dynamically from the center point, and finally, a red circle highlights where the CI crosses zero. Lasts ~2.5 seconds.
- **Final static frame:** Both points connected. The +0.12 point has a vertical error bar, with text noting the CI and the zero-crossing highlighted.
- **Dependencies:** Uses host variables `--accent`, `--muted`, `--rule`, `--ink`.

## 4. `willingness-skill`
- **Slot:** `[data-motif="willingness-skill"]`
- **What it shows:** A 2D scatter comparison of Willingness (Y-axis: 0-14 tasks answered) vs Skill (X-axis: 0-10 capability). It illustrates that the Uncensored 120B answers 6 more tasks, but its skill advantage (+0.12) is practically zero.
- **Animation:** Fades in the "Clean Base" point, then the "Uncensored 120B" point. A dashed line appears connecting them, followed by labels highlighting the gap. Lasts ~2 seconds.
- **Final static frame:** Two nodes representing the models, axes visible, with a vertical dashed line emphasizing the willingness gap and text explaining the skill gap is negligible.
- **Dependencies:** Uses host variables `--accent`, `--surface`, `--muted`, `--rule`, `--ink`.

## 5. `exploit-lab`
- **Slot:** `[data-motif="exploit-lab"]`
- **What it shows:** Ten parallel tracks representing isolated container trials.
- **Animation:** Progress bars grow at randomized speeds. As each finishes, its specific `FLAG{...}` and a `PASS` checkmark fade in. Lasts ~2.5 seconds depending on random speeds.
- **Final static frame:** All 10 progress bars filled. 10 unique flags visible, all marked with green passes.
- **Dependencies:** Uses host variables `--accent`, `--surface`, `--rule`, `--ink`, `--mono`.

## 6. `verifier`
- **Slot:** `[data-motif="verifier"]`
- **What it shows:** The model claim being tested by a buggy verifier (letting rate limits fail, but treating NVD absent as supported) vs the corrected verifier. Followed by a summary of the 10/10 impacket scripts accepted and 0/10 CVE ids.
- **Animation:** The model claim is static. Red arrow and buggy verifier appear, then green arrow and corrected verifier appear. Finally, the fabrication statistics box fades in. Lasts ~3 seconds.
- **Final static frame:** Three main blocks. Left: Model Claim. Middle: Buggy (red) and Corrected (green) verifiers with their logic flows. Right: The summary of accepted fabrications.
- **Dependencies:** Uses host variables `--code-bg`, `--rule`, `--surface`, `--muted`, `--mono`. Hardcodes a few standard red/green hex values for the pass/fail contrast.
