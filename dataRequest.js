
  
  
  /**
   * funcion que define la comparación para el sort del array de datos de tipo
   * dataInput de uso en este programa
   * 
   * @param a Objeto dataInput a comparar
   * @param b Objeto dataInput a comparar
   * @returns nueva posición respectiva en la cadena
   */
  function compare(a,b) {
	  /*
	   * Es necesario comparar la fecha pormenorizada, para asegurarse
	   * que se agrupan las del mismo día, y dentro del mismo día, por
	   * categoría
	   * 
	   */
	if (a.fecha.getYear() == b.fecha.getYear()){
		if(a.fecha.getMonth() < b.fecha.getMonth())
			return -1;
		else{
			if(a.fecha.getMonth() == b.fecha.getMonth()){
				if(a.fecha.getDate() < b.fecha.getDate())
					return -1;
				else{
					if(a.fecha.getDate() == b.fecha.getDate()){
						if(a.categoria < b.categoria)
							return -1;
						if(a.categoria > b.categoria)
							return 1;
						return 0;
					}
					else{
						return 1;					
					}
				}
			}
			else{
				return 1;
			}
		}
	}
	if (a.fecha.getYear() > b.fecha.getYear())
		return 1;
	return -1;
  }
  
  //array para almacenar las lecturas
  var lectArray = [];
  for(i = 0; i<4; i++)
	  lectArray[i] = new Array();
  
  //array para tratar la data a recibir
  var dataFinal = new Array();
  
  
  //array de booleanas de control de lectura
  var recibido = [false,false,false,false,false];
  
  //booleana de control del parseo
  var parseado = false;
  
  

/**
 * función principal que lanza el request
 * 
 * @param index	índice del elemento que queremos leer ( viene dado en la llamada del html )
 * @param origen cadena que especifica el origen del dato para la llamada ajax
 * ( viene dado en la llamada del html )
 * @param requests cantidad de consultas que se harán antes de habilitar a continuar con
 * la ejecución ( viene dado en la llamada del html )
 * 
 */
  function loadDoc(index, origen, requests) {
		

	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function(){

		  //controlamos que sólo se lea una vez, cuando el status sea correcto
			if (this.readyState == 4 && this.status == 200 && recibido[index]==false) {
				document.getElementById("d1-ok").innerHTML = "OK";
				
				//convierte el stream en una cadena
				var text = this.responseText;
				lectArray[index] = JSON.parse(text);
				
				//actualiza el valor de la booleana de control
				recibido[index] = true;
			    
				//actualiza el html para que el usuario vea que el stream fue leido con éxito
				 document.getElementById("d".concat(index).concat("-el")).innerHTML = lectArray[index].length;
				 document.getElementById("d".concat(index).concat("-ok")).innerHTML = "OK";
				 
				  
		    }
			else{
			
				//imprime el status y el readystate para que el usuario vea desde el html
				document.getElementById("d".concat(index).concat("-rs")).innerHTML = this.readyState;
				document.getElementById("d".concat(index).concat("-st")).innerHTML = this.status;
			}
			
			var todoRecibido = true;
			
			//verifica las variables de control y habilita continuar
			for(i=1; i< requests+1; i++) 
				if(recibido[i]!=true)
					todoRecibido = false;
			//crea el botón para continuar
			if(todoRecibido)
				document.getElementById("botonParsear").innerHTML ='<button type="button" onclick="parseData()">Parse data</button>';
	  }
	  
	  xhttp.open("GET", origen, true);
	  xhttp.send();
	}

/**
 * función que retorna un nuevo dato formateado
 * 
 * @param fecha la Fecha del Valor
 * @param cat	la Categoría introducida
 * @param valor	el Valor de la entrada
 * @returns el dato formateado
 */
function nuevoDato(fecha,cat,valor){
	//construcción del objeto para el dataInput
	var dI = {
		fecha: new Date(),
		categoria: "",
		valor: 0
	}
	//asignación de valores al dataInput
	dI.fecha = fecha;
	dI.categoria = cat;
	dI.valor = valor;
	
	return dI;
}

/**
 * Función para el parseo del string de datos introducidos.
 * se llama desde el html
 * 
 */
function parseData(){
	//verifica no haber parseado ya ( evitando multiples parseos ante error de usuario )
	if (parseado == false){
		
		//actualiza booleana de control
		parseado = true;
		
		//para control del usuario imprime las longitudes esperadas en los datos totales
		document.getElementById("expected").innerHTML = "expected: ".concat(lectArray[1].length);
		document.getElementById("expected2").innerHTML = "expected: ".concat(lectArray[2].length+lectArray[1].length);
		document.getElementById("expected3").innerHTML = "expected: ".concat(lectArray[3].length+lectArray[2].length+lectArray[1].length);
			
		//creando las variables para atributos del objeto de input de datos
		var fecha;
		var fechaFormateada;
		var categoria;
		var valor;
		var i;

		/*
		 * como cada conjunto de datos tiene un formato diferente la función de parseo tiene
		 * que escribirse para cada formato.
		 * todas las capturas son mediante un substring entre dos indexOf
		 */
		for(i = 0; i < lectArray[1].length; i++){
			//se construye la fecha como date
			fechaFormateada = new Date(lectArray[1][i].d);
			
			//en este caso es simplemente pasar a mayusculas
			categoria = (lectArray[1][i].cat).toUpperCase();
			
			valor = lectArray[1][i].value;
			
			//almacenados en el array de datos Final
			dataFinal.push(nuevoDato(fechaFormateada,categoria,valor));

		}
		
		//imprime la longitud para evaluar el estado del parseo
		document.getElementById("result").innerHTML = "found: ".concat(dataFinal.length);
		
		for(i = 0; i < lectArray[2].length; i++){
			
			//se descompone la fecha para introducirla a formato date
			fechaFormateada= new Date(lectArray[2][i].myDate);
			
			//unifica el formato de la categoria
			categoria = lectArray[2][i].categ.toUpperCase();
			
			valor = lectArray[2][i].val;

			//almacena dato nuevo en el array
			dataFinal.push(nuevoDato(fechaFormateada,categoria,valor));

		}
		
		//imprime la longitud de la cadena para la comprobación del usuario desde el html
		document.getElementById("result2").innerHTML = "found: ".concat(dataFinal.length);
		
		
		for(i = 0; i < lectArray[3].length; i++){
			
			//se obtiene la fecha
			var auxFecha = lectArray[3][i].raw.substring(
					lectArray[3][i].raw.indexOf("-")-4,
					lectArray[3][i].raw.indexOf("-")+6
			);
			fechaFormateada = new Date(auxFecha); //se le da formato Date
			
			//se obtiene la categoría
			var catAux = lectArray[3][i].raw.substring(
					lectArray[3][i].raw.indexOf("#")+1,
					lectArray[3][i].raw.indexOf('#')+6
					);
			categoria = catAux.toUpperCase();//se la adapta al formato necesitado
			
			//se obtiene el valor
			valor = lectArray[3][i].val;
			
			//almacena dato nuevo en el array de datos
			dataFinal.push(nuevoDato(fechaFormateada,categoria,valor));
		}
		
		//se imprime la longitud de la cadena para que el usuario pueda comprobar desde el html
		document.getElementById("result3").innerHTML = "found: ".concat(dataFinal.length);
		
		//se ordenan los datos con el algoritmo de comparación "compare"
		dataFinal.sort(compare);
		
		//se habilitan los botones para generar los gráficos
		document.getElementById("botonPieChart").innerHTML =
			'<button type="button" onclick="pieChart()">Pie Chart</button>';
		document.getElementById("botonChart").innerHTML =
			'<button type="button" onclick="linnearChart()">Linear Chart</button>';
	}
}

function linnearChart(){
	//array donde unificamos los datos sumando los valores de la misma categoría del mismo día
	var dataUtil = [];
	var i;
	var j = 0;
	//array donde guardamos las diferentes categorias
	var categorias = new Array();
	//insertamos primer valor
	dataUtil.push(dataFinal[j]);
	
	for(i=1; i<dataFinal.length; i++){
		
		if(dataUtil[j].fecha.getYear() == dataFinal[i].fecha.getYear() &&
			dataUtil[j].fecha.getMonth() == dataFinal[i].fecha.getMonth()
			&& dataUtil[j].fecha.getDate() == dataFinal[i].fecha.getDate()){
			//controla que sea el mismo día
			if(dataUtil[j].categoria == dataFinal[i].categoria){
				//en caso de misma categoría suma valores
				dataUtil[j].value = dataUtil[j].value + dataFinal[i].value;
			}
			else{
				//si no, incluye el dato como nuevo y avanza el contador para la comparación
				j++;
				dataUtil.push(dataFinal[i]);
			}
		
		}
		else{
			//si no, incluye el dato como nuevo y avanza el contador para la comparación
			j++;
			dataUtil.push(dataFinal[i]);
		}
		
	
	}
	
	//saca las categorias encontradas
	categorias.push(dataUtil[0].categoria);
	for(i=0; i<dataUtil.length; i++){
		if(categorias.indexOf(dataUtil[i].categoria)==-1)
			categorias.push(dataUtil[i].categoria);
	}
	
	
	
	var dataSet = [];
	
	for (i=0;i<categorias.length;i++){
		//se crea un nuevo data set para su inserción
		var dS = {
				label: "",
				data:[],
				borderColor: ""
			};
		
		//se asigna etiqueta
		dS.label = categorias[i];
		
		//se recorre el array de dataUtil para asignar un conjunto de valores válido al data  set
		for(j=0;j<dataUtil.length;j++){
			if(dataUtil[j].categoria ==categorias[i]){
				var dat ={
						x: dataUtil[j].fecha,
						y: dataUtil[j].valor
				}
				dS.data.push(dat);
			}
		}
		//se asigna color
		dS.borderColor = color(i);
		
		//se inserta el nuevo data set en el array
		dataSet.push(dS);
	};

	//finalmente se asigna valor y se llama al constructor de la libreria chartjs
	var myData = {
			datasets: dataSet	
	};
	var ctx = document.getElementById("linearChart");
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: myData,
	    options: {
	        scales: {
	            xAxes: [{
	                type: 'linear',
	                position: 'bottom'
	            }]
	        }
	    }
	});
}

function pieChart(){
	
	//se crean las variables requeridas por el constructor del chart
	var myData = {
		labels :[],
		datasets: [],
		backgroundColor: []
	};
	var i;
	var j;
	var dataset ={
			data : [],
			backgroundColor : []
	};
	
	//se insertan primeros valores
	myData.labels.push(dataFinal[0].categoria);
	dataset.data.push(0);
	
	//se sacan las categorias encontradas
	for(i=0; i<dataFinal.length; i++){
		if(myData.labels.indexOf(dataFinal[i].categoria)==-1){
			myData.labels.push(dataFinal[i].categoria);
			dataset.data.push(0);//se inicializa la cantidad de datasets
		}
	}
	
	/*
	 * se recorre una vez más el array para asignar a cada dataset los valores
	 * que corresponden a su categoría
	*/
	for(i=0; i<dataFinal.length; i++){
		for(j=0;j<myData.labels.length;j++){
			if(dataFinal[i].categoria==myData.labels[j]){
				dataset.data[j] += dataFinal[i].valor;
			}
		}
	}
	
	//se llama al metodo de asignación de color
	for(i=0;i<dataset.data.length;i++)
		dataset.backgroundColor.push(color(i));
	
	//finalmente se asigna valor y se llama al constructor de la libreria chartjs
	myData.datasets.push(dataset);
	var ctx = document.getElementById("pieChart");
	var myPieChart = new Chart(ctx,{
	    type: 'pie',
	    data: myData
	});

}

/*
 * el método usado para asignar color es arbitrario, funciona hasta con 10
 * categorías diferentes. A partir de 11 categorías asigna color por defecto
 * 
 */ 
function color(index){
	switch(index){
	case 0: case 5:
		return "rgba(192,192,32,1)";
	case 1: case 6:
		return "rgba(192,32,192,1)";
	case 2: case 7:
		return "rgba(32,192,192,1)";
	case 3: case 8:
		return "rgba(0,0,0,1)";
	case 4: case 9:
		return "rgba(255,0,0,1)";
	}
	return "rgba(127,127,127,1)";
}

