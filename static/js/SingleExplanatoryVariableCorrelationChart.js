import { CorrelationChart } from './CorrelationChart.js';
import { SingleExplanatoryVariableStatisticalDataSet } from './node_modules/@statsy/statsy/src/SingleExplanatoryVariableStatisticalDataSet.js';
export default class SingleExplanatoryVariableCorrelationChart extends CorrelationChart {
    constructor(canvas, paper, data, document) {
        super(canvas, paper, new SingleExplanatoryVariableStatisticalDataSet(data), document);
        this.variable_names_path = null;
        this.correlation_coefficient_path = null;
    }
    draw_variable_names() {
        if (this.statistical_dataset) {
            let variable_names_text = 'dependent variable: ' + this.statistical_dataset.dependent_variable_name + '\n';
            variable_names_text += 'explanatory variable: ' + this.statistical_dataset.explanatory_variable_name;
            if (this.variable_names_path == null) {
                this.variable_names_path = this.draw_text(450, 20, variable_names_text, 0, 14, 'white');
                this.variable_names_path.justification = 'left';
            }
            else {
                this.variable_names_path.content = variable_names_text;
            }
        }
    }
    draw_correlation_coefficient(varX, varY) {
        if (this.statistical_dataset) {
            const coefficient = this.statistical_dataset.correlationCoefficient(varX, varY);
            const print_text = 'ρ:' + coefficient;
            if (this.correlation_coefficient_path == null) {
                this.correlation_coefficient_path = this.draw_text(20, 20, print_text, 0, 14, 'white');
                this.correlation_coefficient_path.justification = 'left';
            }
            else {
                this.correlation_coefficient_path.content = print_text;
            }
        }
    }
    draw() {
        if (this.paper && this.statistical_dataset) {
            //this.resize_and_reposition_canvas(this.canvas_required_width);
            const view_size = this.paper.view.size;
            this.draw_background_solid_rectangle(0, 0, view_size.width, view_size.height, this.background_color);
            this.drawAxisLines();
            this.draw_data_points();
            this.drawLeastSwuaresFitLine(this.statistical_dataset.explanatory_value_name, this.statistical_dataset.dependent_variable_name);
            this.draw_correlation_coefficient(this.statistical_dataset.explanatory_value_name, this.statistical_dataset.dependent_variable_name);
            this.draw_variable_names();
        }
    }
}
