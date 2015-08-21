        
      
         var pieDataset = [{
          a:'10',
          color:'#F7464A',
          highlight:'#FF5A5E'},{
          a:'15',
          color:'#46BFBD',
          highlight:'#5AD3D1'}, {
          a:'20',
          color:'#FDB45C',
          highlight:'#FFC870'}, {
          a:'23',
          color:'#949FB1',
          highlight:'#A8B3C5'}, {
          a:'40',
          color:'#4D5360',
          highlight:'#616774'}, {
          a:'55',
          color:'#CC66FF',
          highlight:'#CC99FF'},         
          ]  ;      

         var svgWidth =300; // width and height
         var svgHeight=300;

     //code for pie chart    
      
         var svg = d3.select("#pie")
                     .append("svg")
                     .attr("width",svgWidth)
                     .attr("height",svgHeight)
                     .attr("padding-right",20);
                  //create SVG element       

         var outerRadius = Math.min(svgWidth, svgHeight) / 2;
         var innerRadius = 0;
         var arcOnload = d3.svg.arc()
                         .innerRadius(innerRadius)
                         .outerRadius(outerRadius-5);
         var arcHover = d3.svg.arc()
                          .innerRadius(innerRadius)
                          .outerRadius(outerRadius-2 );
          

         var pie = d3.layout.pie() 
                     .sort(function(a,b){
                       return d3.ascending(a,b);
                     })
                     .value(function(d) { return 2*(d.a); });                  
               

         
         var arcs = svg.selectAll("g.arc")
                       .data(pie(pieDataset))
                       .enter()
                       .append("g")
                       .attr("class","arc")
                       .attr("transform","translate(" + outerRadius + "," + outerRadius + ")");                      

     

         arcs.append("path")             
             .on("mouseover",function(d){                    // to highlight the slice on hover
                 d3.select(this)
                   .attr("stroke","white")                              
                   .attr("stroke-width",2)
                   .attr("d",arcHover)
                   .transition()
                   .duration(50)                                    
                   .attr("fill",function(d){
                    return d.data.highlight;
              })
              })             
            .on("mouseleave", function(d){
              d3.select(this).transition()
                   .attr("stroke","none")
                   .attr("d",arcOnload)
                   .attr("fill",function(d,i){
                      return d.data.color;
              });
              })
            .transition()  
            .delay(function(d,i){   // smooth transition per the order of data array
                return i*90;
             })
            .attr("fill",function(d,i){
              return d.data.color;
              })             
            .attr("d",arcOnload);
      

         arcs.append("text")
             .attr("transform",function(d){
               return "translate(" + arcOnload.centroid(d) + ")";
             })
             .attr("text-anchor","middle")
             .attr("fill","white")
             .transition()  
             .delay(function(d,i){   // smooth transition per the order of data array
                return i*90;
             })
             .text(function(d){
               return d.value; 
             }); 

 // code for  bar graph 
       
        var barDataset = [
            {x: "Aug 01", y: 10},
            {x: "Aug 02", y: 8 },
            {x: "Aug 03", y: 13},
            {x: "Aug 04", y: 22},
            {x: "Aug 05", y: 18},
            {x: "Aug 06", y: 15},
            {x: "Aug 07", y: 24}, 
           ]
             
        var margin = {top: 20, right: 10, bottom: 20, left: 50};

        var svgWidth = 450 - margin.left - margin.right;
        var svgHeight = 300 - margin.top - margin.bottom;
        //   svgWidth = 450;
        //   svgHeight = 300;    


        var y = d3.scale.linear()
          .domain([0, d3.max(barDataset, function(x) {
              return x.y;
          })])
          .range([0,svgHeight]);

        var y1 = d3.scale.linear()
          .domain([0, d3.max(barDataset, function(x) {
              return x.y;
          })])
          .range([svgHeight,0]);

        var x = d3.scale.ordinal()
                  .domain(_.map(barDataset, function(d) { return d.x;}))
                  .rangeRoundBands([0, svgWidth], 0.10);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");


        var yAxis = d3.svg.axis()
            .scale(y1)
            .orient("left");

    
        var barPadding = 2;
        svg = d3.select("#bar")
               .append("svg")
               .attr("width",svgWidth+ margin.left + margin.right)
               .attr("height",svgHeight+margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  //create SVG element

        var tip = d3.tip()
                   .attr("class", "d3-tip")
                   .offset([-10, 0])
                   .html(function(d) {
                        return "<strong>Users:</strong> <span style='color:red'>" + d.y + "</span>";
                      }) ;


        svg.call(tip);  
   

        svg.selectAll("rect")
           .data(barDataset)  
           .enter()
           .append("rect") 
           .attr("class", "barChart")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .transition()  
           .delay(function(d,i){   // smooth transition from left to right
            return i*50;
          }) 
           //.delay(500)   // all bars display together with a delay of 500         
           .attr("x",function(d){
            return x(d.x);
          })      
           .attr("y",function(d){ 
           return svgHeight - y(d.y); 
           })// height minus data  
        //.attr("y",0)
                   
          .attr("width",30)
          .attr("height",function(d){
             return y(d.y) ; 
          })
          .attr("fill",function(d){
            return "rgb(0,100,"+(d.y*10)+")";
          }) ;      


        svg.selectAll("text")
           .data(barDataset) 
           .enter()
           .append("text")
           .transition()
           .delay(function(d,i){
            return i*50;             // smooth transition from left to right          
          }) 
       
          .text(function(d){
            return d.y;
          }) 
          .attr("x",function(d){
            return x(d.x)+15;
          }) 
          .attr("y",function(d){ 
           return (svgHeight - y(d.y)+10); 
           })
          .attr("font-family","sans-serif")
          .attr("font-size","11px")
          .attr("fill","white")
          .attr("text-anchor","middle")  ;


        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + svgHeight + ")")
           .call(xAxis)
           .append("text")        
           .attr("x", svgWidth-8)
           .attr("dx", ".71em")
           .style("text-anchor", "end")
           .text("Days");

        svg.append("g")
           .attr("class", "y axis")
           .attr("transform", "translate(0,0)")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text("No. of Users");

        