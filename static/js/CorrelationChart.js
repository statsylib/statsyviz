import { SingleExplanatoryVariableStatisticalDataSet } from "./node_modules/@statsy/statsy/src/SingleExplanatoryVariableStatisticalDataSet.js";
import TwoDimensionalChart from './TwoDimensionalChart.js';
export class CorrelationChart extends TwoDimensionalChart {
    constructor(canvas, paper, data, document) {
        super(canvas, paper, document);
        this.y_border = 50;
        this.x_border = 50;
        this.label_name = 'label';
        this.statistical_dataset = new SingleExplanatoryVariableStatisticalDataSet([]);
        this.paperPoint = [];
        this.least_squares_fit_path = null;
        this.statistical_dataset = data;
    }
    to_screen_height_units(value) {
        return this.paper.view.size.height - (value * (this.paper.view.size.height - this.y_border) / this.statistical_dataset.max_dependent_variable_value);
    }
    from_screen_height_units(value) {
        return value * this.statistical_dataset.max_dependent_variable_value / (this.paper.view.size.height - this.y_border);
    }
    to_screen_width_units(value) {
        return value * (this.paper.view.size.width - this.x_border) / this.statistical_dataset.max_explanatory_value;
    }
    from_screen_width_units(value) {
        return value * this.statistical_dataset.max_explanatory_value / (this.paper.view.size.width - this.x_border);
    }
    resize_and_reposition_canvas(required_width) {
        if (this.document && this.canvas) {
            if (required_width > this.document.documentElement.clientWidth) {
                this.document.body.style.width = required_width + 'px';
                this.document.documentElement.scrollLeft = required_width - this.document.documentElement.clientWidth;
            }
            else {
                this.document.body.style.width = this.document.documentElement.clientWidth;
            }
            this.paper.setup(this.canvas);
        }
    }
    drawAxisLines() {
        this.draw_line(this.x_border, this.paper.view.size.height - this.y_border, this.paper.view.size.width - this.x_border, this.paper.view.size.height - this.y_border, 'white', 1);
        this.draw_text(this.paper.view.size.width / 2, this.paper.view.size.height - (this.y_border / 2), this.statistical_dataset.explanatory_value_name, 0, 12, 'white');
        this.draw_line(this.x_border, this.paper.view.size.height - this.y_border, this.x_border, this.y_border, 'white', 1);
        this.draw_text(this.x_border / 2, this.paper.view.size.height / 2, this.statistical_dataset.dependent_variable_name, 270, 12, 'white');
    }
    drawLeastSwuaresFitLine(varX, varY) {
        const leastSquaresRegression = this.statistical_dataset.leastSquaresRegression(varX, varY);
        const m = leastSquaresRegression.m;
        const b = leastSquaresRegression.b;
        const leastSquaresX1 = this.to_screen_width_units(this.statistical_dataset.minKeyValue(this.statistical_dataset.explanatory_value_name));
        const leastSquaresY1 = this.to_screen_height_units(m * this.statistical_dataset.minKeyValue(this.statistical_dataset.explanatory_value_name) + b);
        const leastSquaresX2 = this.to_screen_width_units(this.statistical_dataset.max_explanatory_value);
        const leastSquaresY2 = this.to_screen_height_units(m * this.statistical_dataset.max_explanatory_value + b);
        if (this.least_squares_fit_path == null) {
            this.least_squares_fit_path = this.draw_line(leastSquaresX1, leastSquaresY1, leastSquaresX2, leastSquaresY2, 'red', 2);
        }
        else {
            this.least_squares_fit_path.removeSegment(1);
            this.least_squares_fit_path.removeSegment(0);
            this.least_squares_fit_path.add(new this.paper.Point(leastSquaresX1, leastSquaresY1));
            this.least_squares_fit_path.add(new this.paper.Point(leastSquaresX2, leastSquaresY2));
        }
    }
    draw_data_points() {
        const is_not_initialized = this.paperPoint.length == 0;
        for (let i = 0; i < this.statistical_dataset.data.length; i++) {
            const x_value = this.to_screen_width_units(this.statistical_dataset.data[i][this.statistical_dataset.explanatory_value_name]);
            const y_value = this.to_screen_height_units(this.statistical_dataset.data[i][this.statistical_dataset.dependent_variable_name]);
            if (is_not_initialized) {
                this.paperPoint[i] = this.draw_circle(x_value, y_value, 5, 'white');
            }
            else {
                this.paperPoint[i].position.x = x_value;
                this.paperPoint[i].position.y = y_value;
            }
            this.paperPoint[i].onMouseDrag = this.createPointMouseDragEventHandler(i, this);
            this.paperPoint[i].onMouseUp = this.createPointMouseUpEventHandler(this);
            this.paperPoint[i].onMouseEnter = this.createPointMouseEnterEventHandler(i, this);
            this.paperPoint[i].onMouseLeave = this.createPointMouseLeaveEventHandler(i, this);
        }
    }
    createPointMouseDragEventHandler(index, that) {
        return function (event) {
            that.dragging_point = true;
            const tooltip = that.paperPoint[index].parent.children['tooltip'];
            if (tooltip) {
                tooltip.remove();
            }
            that.paperPoint[index].fillColor = 'yellow';
            that.statistical_dataset.increaseDataPoint(index, that.statistical_dataset.explanatory_value_name, that.from_screen_width_units(event.delta.x));
            that.statistical_dataset.decreaseDataPoint(index, that.statistical_dataset.dependent_variable_name, that.from_screen_height_units(event.delta.y));
            that.draw_data_points();
            that.drawLeastSwuaresFitLine(that.statistical_dataset.explanatory_value_name, that.statistical_dataset.dependent_variable_name);
            that.draw_correlation_coefficient(that.statistical_dataset.explanatory_value_name, that.statistical_dataset.dependent_variable_name);
            that.draw_variable_names();
        };
    }
    createPointMouseUpEventHandler(that) {
        return function () {
            if (that.dragging_point) {
                that.dragging_point = false;
                that.draw_data_points();
                that.drawLeastSwuaresFitLine(that.statistical_dataset.explanatory_value_name, that.statistical_dataset.dependent_variable_name);
                that.draw_correlation_coefficient(that.statistical_dataset.explanatory_value_name, that.statistical_dataset.dependent_variable_name);
                that.draw_variable_names();
            }
        };
    }
    createPointMouseEnterEventHandler(index, that) {
        return function () {
            const tooltip_x = that.paperPoint[index].position.x - 20;
            const tooltip_y = that.paperPoint[index].position.y - 50;
            const tooltip_text = that.statistical_dataset.data[index][that.label_name] + '\n' + that.statistical_dataset.dependent_variable_name + ': ' + that.statistical_dataset.data[index][that.statistical_dataset.dependent_variable_name] + '\n' + that.statistical_dataset.explanatory_value_name + ': ' + that.statistical_dataset.data[index][that.statistical_dataset.explanatory_value_name];
            const tooltip = that.draw_text(tooltip_x, tooltip_y, tooltip_text, 0, 12, 'white');
            tooltip.name = 'tooltip';
            that.paperPoint[index].parent.addChild(tooltip);
        };
    }
    createPointMouseLeaveEventHandler(index, that) {
        return function () {
            const tooltip = that.paperPoint[index].parent.children['tooltip'];
            if (tooltip) {
                tooltip.remove();
            }
        };
    }
    draw() {
        const view_size = this.paper.view.size;
        this.drawAxisLines();
        this.draw_background_solid_rectangle(0, 0, view_size.width, view_size.height, this.background_color);
        this.draw_data_points();
    }
}
