module powerbi.extensibility.visual {
    
    interface TextViewModel {
        settings: TextSettings;
    };

    interface TextSettings {
        TextDetails: {
            fontSize: number;
            fontFamily: string;
            bold: boolean;
            scrollable: boolean;
            color: string;
        };
    }

    function visualTransform(options: VisualUpdateOptions, host: IVisualHost): TextViewModel
    {
        let dataViews = options.dataViews;
        let objects = dataViews[0].metadata.objects;

        let defaultSettings: TextSettings = {
            TextDetails: {
                fontSize: 10,
                fontFamily: "Arial",
                bold: false,
                scrollable: false,
                color: "#000000",
            }
        };

        let textSettings: TextSettings = {
            TextDetails: {
                fontSize: getValue<number>(objects, 'TextDetails', 'fontSize', defaultSettings.TextDetails.fontSize),
                fontFamily: getValue<string>(objects, 'TextDetails', 'fontFamily', defaultSettings.TextDetails.fontFamily),
                bold: getValue<boolean>(objects, 'TextDetails', 'bold', defaultSettings.TextDetails.bold),
                scrollable: getValue<boolean>(objects, 'TextDetails', 'scrollable', defaultSettings.TextDetails.scrollable),
                color: getValue<string>(objects, 'TextDetails', 'color', defaultSettings.TextDetails.color)
            }
        };

        return {
           settings: textSettings,
        };
    }

    export class Visual implements IVisual {
        private host: IVisualHost;
        private target: HTMLElement;
        private textSettings: TextSettings;

        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.target = options.element;
        }

        public update(options: VisualUpdateOptions) {
            let viewModel: TextViewModel = visualTransform(options, this.host);
            let settings = this.textSettings = viewModel.settings;

            var fontsize = settings.TextDetails.fontSize;
            var fontfamily = settings.TextDetails.fontFamily;
            var color = settings.TextDetails.color;

            var innerHTML = "<div>";

            if (settings.TextDetails.scrollable)
            {
                innerHTML = `<div class="title">`
            }

            for (var i=0; i<options.dataViews[0].table.rows.length; i++)
            {
                if (settings.TextDetails.bold)
                {
                    innerHTML += `<p style="margin-top: -1px; font-size: ${fontsize}pt; font-family: ${fontfamily}; color: ${color}"><b>${options.dataViews[0].table.rows[i]}</b></p>`;
                }
                else
                {
                    innerHTML += `<p style="margin-top: -1px; font-size: ${fontsize}pt; font-family: ${fontfamily}; color: ${color}">${options.dataViews[0].table.rows[i]}</p>`;
                }
            }

            innerHTML += "</div>";

            this.target.innerHTML = innerHTML;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            switch(objectName) {
                case "TextDetails":
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            fontSize: this.textSettings.TextDetails.fontSize,
                            fontFamily: this.textSettings.TextDetails.fontFamily,
                            bold: this.textSettings.TextDetails.bold,
                            scrollable: this.textSettings.TextDetails.scrollable,
                            color: this.textSettings.TextDetails.color
                        },
                        selector: null
                    });                
            };

            return objectEnumeration;
        }
    }
}