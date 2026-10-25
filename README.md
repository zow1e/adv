# HDB resale explorer

A data-visualization coursework repository. The main assignment in `task1/` explores HDB resale prices, floor area, and transaction counts with coordinated D3 charts. Other folders contain supporting exercises and tutor examples.

## Technical skills

**JavaScript · D3.js · HTML/CSS · jQuery · Bootstrap**

The assignment demonstrates CSV parsing, type/date conversion, grouped means/counts, town and time filtering, and line, bar, stacked, and pie-chart updates. The separate `Task 2` notebook uses Python, pandas, Seaborn, and Matplotlib for resort-booking exploration.

## Key files

- [task1/index.html](task1/index.html): dashboard markup and controls.
- [task1/js/main.js](task1/js/main.js): load/prepare data, share filter state, and update charts.
- `task1/js/lineChart.js`, `barfile.js`, `stackedFile.js`, and `pieChart.js`: chart implementations.
- `task1/data/hdb-resale-prices_2000-2023May.csv`: supplied dashboard dataset.
- [Task 2/assignment_task2_student.ipynb](Task%202/assignment_task2_student.ipynb): Seaborn exploratory exercises.

## Run the dashboard locally

Serve the repository over HTTP so the browser can load its CSV. For example, with Python installed, run from the repository root:

```sh
python -m http.server 8000
```

Open **http://localhost:8000/task1/**. The page loads D3, d3fc, jQuery, Bootstrap, and related assets from CDNs, so internet access is needed. There is no npm build or backend.

For the Seaborn notebook, provide the referenced `bidadari_resort_bookings.csv` and adjust paths before running it in Jupyter/Colab.

## Scope

Tutor folders contain learning materials and answer examples; they are not presented as independently authored project features. The dashboard resets controls on a ten-second interval in `main.js`. Some labels and calculations need review before analytical use. No prediction model, validated business conclusion, or deployed-demo claim is made.
