let forceSim, isD3Sim;

onmessage = function(e) {

    switch (e.data.order) {
        case 'init':
            init(e.data.state);
            break;
        case 'tick':
            tick(e.data.cycles);
            break;
    }
};

function init(state) {
    isD3Sim = state.forceEngine !== 'ngraph';
    if (isD3Sim) {
        // D3-force
        (forceSim = state.d3ForceLayout)
            .stop()
            .alpha(1)// re-heat the simulation
            .numDimensions(state.numDimensions)
            .nodes(state.graphData.nodes)
            .force('link')
            .id(d => d[state.idField])
            .links(state.graphData.links);
    } else {
        // ngraph
        const graph = ngraph.graph();
        state.graphData.nodes.forEach(node => { graph.addNode(node[state.idField]); });
        state.graphData.links.forEach(link => { graph.addLink(link.source, link.target); });
        layout = ngraph['forcelayout' + (state.numDimensions === 2 ? '' : '3d')](graph);
        layout.graph = graph; // Attach graph reference to layout
    }
}

function tick(numCycles=1) {
    for (let i=0; i<numCycles; i++) {
        postMessage(i);
        forceSim[isD3Sim?'tick':'step']();
    }
    postMessage('done');
}