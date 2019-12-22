
var dataset = {}

function init() {
    console.log("Initializing Dashboard")
    var dataSelector = d3.select("select");
    console.log(dataSelector);

    d3.json("samples.json").then(function(jsonData){
        dataset = jsonData
        console.log(dataset);


        var options = dataset.names;
        console.log(options);
        options.forEach((sample) => {
            dataSelector.append("option")
                .text(sample)
                .property("value", sample);
        })
    
        updateBarChart(940);
        updateBubbleChart(940);
        updateInfoBox(940);
    
    
    })
}

function optionChanged(sampleID){
    console.log(`Dropdown changed to ${sampleID}`)
    updateBarChart(sampleID);
    updateBubbleChart(sampleID);
    updateInfoBox(sampleID);
}

function updateBarChart(sampleID){
    console.log(`Updating Bar Chart: Sample ${sampleID}`)

    var samples = dataset.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];

    var otuIDs = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    var barData = [
        {
            x: sampleValues.slice(0,10).reverse(),
            y: yticks,
            type: "bar",
            text: otuLabels.slice(0,10).reverse,
            orientation: "h"

        }
    ]

    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t:30, l:150}
    }

    Plotly.newPlot("bar", barData, barLayout);
}

function updateInfoBox(sampleID){
    console.log(`Updating Info Box: Sample ${sampleID}`)

    var metadata = dataset.metadata;


    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];
 
    console.log(result);

    var list = d3.select("#sample-metadata");
    list.html("");
    list.append("li").text(`ID: ${result.id}`);
    list.append("li").text(`Ethnicity: ${result.ethnicity}`);
    list.append("li").text(`Gender: ${result.gender}`);
    list.append("li").text(`Age: ${result.age}`);
    list.append("li").text(`Location: ${result.location}`);
    list.append("li").text(`Bbtype: ${result.bbtype}`);
    list.append("li").text(`Wfreq: ${result.wfreq}`);

}

function updateBubbleChart(sampleID){
    console.log(`Updating Bubble Chart: Sample ${sampleID}`)

    var samples = dataset.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];

    var otuIDs = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var bubbleData = [{
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
            color: otuIDs,
            size: sampleValues
        }
    }]

    var bubbleLayout = {
        title: "Number of Bacteria Cultures Found by OTU ID"
    }
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
}

init();