console.log("Version 1 - Adjacency List (Array) - Undirected")

function Graph(v) { 
  this.vertices = v;
  this.edges = 0;
  this.adj = [];
  for(var i = 0; i < this.vertices; ++i) {  
    this.adj[i] = [];
    this.adj[i].push("");
  }

  this.marked = [];
  for(var i = 0; i < this.vertices; ++i) {
    this.marked[i] = false;
  }
}

Graph.prototype = {
  
  constructor: Graph,
  
  add_edge: function(v, w){
    this.adj[v].push(w);
    this.adj[w].push(v);
    this.edges++;
  },

  show_graph: function(){
    for(var i = 0; i < this.vertices; ++i) {
      var output = i + " -> "
      for(var j = 0; j < this.vertices; ++j) {
        if(this.adj[i][j] != undefined) {
          output += this.adj[i][j] + " ";
        }
      }
      console.log(output);
    }
  },

  depth_first_search: function(v){
    this.marked[v] = true;
    if(this.adj[v] != undefined){
      console.log("Visited vertex: " + v);

      for (var w = 0; w < this.adj[v].length; w++){
        var element = this.adj[v][w];
        if(!this.marked[element])
          this.depth_first_search(element);
      }
    }
  }

}

g = new Graph(5);
g.add_edge(0, 1);
g.add_edge(0, 2);
g.add_edge(1, 3);
g.add_edge(2, 4);
g.show_graph();
g.depth_first_search(0);



