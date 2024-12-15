//import { Path, Point } from './paper-full.min.js';
export default class TwoDimensionalChart {
    constructor(canvas, paper, document) {
        this.canvas = null;
        this.paper = null;
        this.document = null;
        this.background_color = '#101010';
        this.separator_line_color = '#282828';
        this.current_epoch_color = '#282828';
        this.canvas = canvas;
        this.paper = paper;
        this.document = document;
    }
    draw_circle(x, y, radius, color) {
        return new Path.Circle({
            center: new Point(x, y),
            radius: radius,
            fillColor: color,
        });
    }
    draw_translucent_rectangle(width, height, strokeColor, fillColor, opacity, blockRounding) {
        const rect = new this.paper.Rectangle([0, 0], [width, height]);
        const path = new this.paper.Path.Rectangle(rect, blockRounding);
        path.strokeColor = strokeColor;
        path.fillColor = fillColor;
        path.opacity = opacity;
        return path;
    }
    draw_background_solid_rectangle(x, y, width, height, color) {
        const rect = new this.paper.Path.Rectangle({
            point: [x, y],
            size: [width, height],
            strokeColor: color
        });
        rect.sendToBack();
        rect.fillColor = color;
    }
    draw_line(start_x, start_y, end_x, end_y, color, strokeWidth) {
        const linePath = new this.paper.Path();
        linePath.strokeColor = color;
        linePath.add(new this.paper.Point(start_x, start_y));
        linePath.add(new this.paper.Point(end_x, end_y));
        linePath.strokeWidth = strokeWidth;
        return linePath;
    }
    draw_text(x, y, text, rotation, fontSize, color) {
        return new this.paper.PointText({
            point: [x, y],
            content: text,
            style: {
                fontFamily: 'Courier New',
                fontWeight: 'bold',
                fontSize: fontSize,
                fillColor: color,
                justification: 'center'
            }
        }).rotate(rotation);
    }
    draw_solid_rectangle(x, y, width, height, color, blockRounding) {
        const rect = new this.paper.Rectangle([x, y], [width, height]);
        const path = new this.paper.Path.Rectangle(rect, blockRounding);
        path.fillColor = color;
        return path;
    }
}
