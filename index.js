
            var colorScaleTracker = 1; 
            //Width and height		
            var w = 960;
			var h = 900;
            
			//Define path generator
			var path = d3.geoPath(); 

			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

            var quantizeMax; 
            var quantizeMin; 

            var colorQuantize = d3.scaleQuantize()
              //.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]) 
                     .range(d3.schemeOrRd[9]);  

            //Define quantize scale to sort data values into buckets of color
			var colorThreshold = d3.scaleThreshold()
                .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
                .range(d3.schemeOrRd[9]);
								//Colors derived from ColorBrewer, by Cynthia Brewer, and included in
								//https://github.com/d3/d3-scale-chromatic


			d3.csv("density-data-08.csv", function(data) {

    
                quantizeMin = d3.min(data, function(d) { return d.Population_Density_PerLandSquareMile});
                quantizeMax = d3.max(data, function(d) { return d.Population_Density_PerLandSquareMile});
                colorQuantize.domain([quantizeMin, quantizeMax]);
                
                
                
				//Load in GeoJSON data
				d3.json("co-merge-topo.json", function(error, topology) {
                    
                    var map = d3.map();
                        // for each line of the input file
                        data.forEach(function(d) {
                        // add an object to the map having:
                        // tract as key
                        // population/area as value
                        map.set(d.FIPS, (d.Population_Density_PerLandSquareMile))
                    });
    
                    console.log(map); 
                
                    
                    if (error) throw error; 
                    
				        var geojsonTracts = topojson.feature(topology, topology.objects.tracts); 
                        var geojsonCounties = topojson.feature(topology, topology.objects.counties); 
				                    
                    
					svg.selectAll("path")
					   .data(geojsonTracts.features)
					   .enter()
					   .append("path")
                        .attr("class", "tract")
					   .attr("d", path)
					   .style("fill", function(d) {
					   		//Get data value
                            //console.log(d); 
                            var jsonTract = d.id; 
                            //console.log(jsonTract); 
					   		var value = map.get(jsonTract);  
					   		if (value) {
					   			//If value exists…
						   		return colorThreshold(value);
					   		} else {
					   			//If value is undefined…
						   		return "#ccc";
					   		}
                    }); 
					  
                    
                    svg.append("path")
					   .datum(geojsonCounties)
					   .attr("d", path)
                       .attr("fill", "none")
                       .attr("stroke-opacity", 0.1)
                       .attr("stroke", "#000"); 
                    
                     
			
                    
			});
    });



function updateMap() {
   // var svg = d3.select("body").transition(); 
            var curr = colorScaleTracker; 
            if (colorScaleTracker == 1) {
                colorScaleTracker = 2; 
            } else {
                colorScaleTracker = 1; 
            }
            console.log(curr);
            console.log(colorScaleTracker);
            console.log("here");
            d3.csv("density-data-08.csv", function(error, data) {
               
                quantizeMin = d3.min(data, function(d) { return d.Population_Density_PerLandSquareMile});
                quantizeMax = d3.max(data, function(d) { return d.Population_Density_PerLandSquareMile});
                colorQuantize.domain([quantizeMin, quantizeMax]);
            
                var map = d3.map();
                        // for each line of the input file
                        data.forEach(function(d) {
                        // add an object to the map having:
                        // tract as key
                        // population/area as value
                        map.set(d.FIPS, (d.Population_Density_PerLandSquareMile))
            });

            //update the fill color 
            svg.selectAll(".tract")
            .transition()
            .duration(750)
            .style("fill", function(d) {
               // console.log(d); 
               // console.log(curr); 
                if (curr == 1) {
                    var jsonTract = d.id; 
                    var value = map.get(jsonTract); 
                    //console.log(jsonTract);
                    //console.log(value); 
                    if(value) {
                        // if 1 (meaning currently in colorThreshold)
                        // switch to other scale
                        return colorQuantize(value); 
                    } else {
				        //If value is undefined…
				 		return "#ccc";
                    } 
                } else {
                    var jsonTract = d.id; 
                    var value = map.get(jsonTract);
                    //console.log(jsonTract);
                    //console.log(value); 
                    if(value) {
                        // if not 1 (meaning currently in colorQuantize)
                        // switch to other scale
                        return colorThreshold(value); 
                    } else {
				        //If value is undefined…
				 		return "#ccc";
                    }
                }

           });  
                
                
                
            //update the legend    
           /* svg.select(legendRects)
                .transition()
                .duration(750)    
                .data(colorQuantize.range().map(function(d) {
                    d = colorQuantize.invertExtent(d);
                    if (d[0] == null) d[0] = x.domain()[0];
                    if (d[1] == null) d[1] = x.domain()[1];
                    return d; 
                }))
                .enter()
                .append("rect")
                    .attr("height", 8)
                    .attr("x", function(d) { return x(d[0]); })
                    .attr("width", function(d) {return x(d[1]) - x(d[0]); })
                    .attr("fill", function(d) { return colorQuantize(d[0]); }); */
                
                
      });
    
    
}

