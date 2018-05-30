                            /*Clases implementadas
____________________________________________________________________________*/
class distrito{
    constructor(nombreDistrito,latitudDistrito,longitudDistrito){
        this._nombre=nombreDistrito;
        this._latitud=latitudDistrito;
        this._longitud=longitudDistrito;
        this._nCrimenes=0;
        this._distanciaNYU=0;
        this._asequibilidad=0;
        this._ncasas=0;
    }
    get nombre(){return this._nombre;}
    get latitud(){return this._latitud;}
    get longitud(){return this._longitud;}
    get nCrimenes(){return this._nCrimenes;}
    get distanciaNYU(){return this._distanciaNYU;}
    get asequibilidad(){return this._asequibilidad;}
    get ncasas(){return this._ncasas;}
    
    set distanciaNYU(distanciaIngresada){
        this._distanciaNYU=distanciaIngresada;
    }
    
    set asequibilidad(asequibilidadIngresada){
        this._asequibilidad=asequibilidadIngresada;
    }
    
    aumentarCrimenes(){
        this._nCrimenes++;
    }
    
    aumentarCasas(incremento){
        this._asequibilidad=parseInt(this._asequibilidad)+parseInt(incremento);
        this._ncasas++;
    }
    
    calcularAsequibilidad(){
        this._asequibilidad=(this._asequibilidad/this._ncasas).toFixed(3);
    }
}


                    /*Arreglos para utilizar datos de JSON
____________________________________________________________________________*/
var Json_seguridad = [];
var Json_asequibilidad = [];


                    /*Variables utilizadas para el programa
____________________________________________________________________________*/
var mapa;
var queens = new distrito('QUEENS',40.7285523,-73.8298588);
var bronx = new distrito('BRONX',40.84676, -73.873207);
var manhattan = new distrito('MANHATTAN',40.77877,-73.9708397);
var brooklyn = new distrito('BROOKLYN',40.6411005,-73.9487477);
var statenIsland = new distrito('STATEN ISLAND',40.576281, -74.144839);


                            /*Inicialización del mapa
____________________________________________________________________________*/
function iniciarMapa(){
    //Coordenadas
    var centroMapa = new google.maps.LatLng(40.7291,-73.9965);
    var coordenadasQueens = new google.maps.LatLng(queens.latitud,queens.longitud);
    var coordenadasBrooklyn = new google.maps.LatLng(brooklyn.latitud,brooklyn.longitud);
    var coordenadasBronx = new google.maps.LatLng(bronx.latitud,bronx.longitud);
    var coordenadasManhattan = new google.maps.LatLng(manhattan.latitud,manhattan.longitud);
    var coordenadasStatenIsland = new google.maps.LatLng(statenIsland.latitud,statenIsland.longitud);
    
	var mapOptions = { zoom: 11, center: centroMapa}
	mapa = new google.maps.Map(document.getElementById('mapa'), mapOptions);
    
    //Marker para Queens
    var marker = new google.maps.Marker({
        position: coordenadasQueens,
        map: mapa, 
        label : 'Queens',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
    
    //Marker para Brooklyn
    var marker = new google.maps.Marker({
        position: coordenadasBrooklyn,
        map: mapa, 
        label : 'Brooklyn',
        icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
    });
    
    //Marker para Manhattan
    var marker = new google.maps.Marker({
        position: coordenadasManhattan,
        map: mapa, 
        label : 'Manhattan',
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });
    
    //Marker para Bronx
    var marker = new google.maps.Marker({
        position: coordenadasBronx,
        map: mapa, 
        label : 'Bronx',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });
    
    //Marker para Staten Island
    var marker = new google.maps.Marker({
        position: coordenadasStatenIsland,
        map: mapa, 
        label : 'Staten Island',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    
    //Marker para NYU
	var marker = new google.maps.Marker({
        position: centroMapa,
        map: mapa, 
        label : 'NYU Stern School of Business',
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    });
}

                                /*Funciones varias
____________________________________________________________________________*/
$(function(){
    
    //Recogida de datos de JSON
	url ='https://data.cityofnewyork.us/resource/9s4h-37hy.json';
	$.getJSON(url, function(data){
		$.each(data,function(i,entrada){
			Json_seguridad.push(entrada);
		});
		console.log('Datos de seguridad cargados');
	});
	
	url1 ='https://data.cityofnewyork.us/resource/q3m4-ttp3.json';
	$.getJSON(url1, function(data){
		$.each(data,function(i,entrada){
			Json_asequibilidad.push(entrada);
		});
		console.log('Datos de asequibilidad cargados');
	});
	
});

function calcularDistancia(lat1,long1,lat2,long2){
    return (google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat1, long1), new google.maps.LatLng(lat2, long2))/1000).toFixed(3);
    
}
                        /*Eventos de click en botones
____________________________________________________________________________*/

botonCentrar.onclick = function (){
    //Centrar el mapa en las coordenadas de la NYU
    mapa.setCenter(new google.maps.LatLng(40.7291,-73.9965));
}

botonShow.onclick = function(){
    //Colorear los distritos
    mapa.data.loadGeoJson("http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson");

    mapa.data.setStyle(function(feature) {
        var ciudad = feature.getProperty('BoroCD');
        var numeroCiudad = Number(String(ciudad).charAt(0));
        var color;
        switch(numeroCiudad) {
            case 1:
                color = '#ff661a'; //Naranja
                break;
                
            case 2:
                color= '#9999ff'; //Azul
                break;
                
            case 3:
                color= '#ffff80'; //Amarillo
                break;
                
            case 4:
                color= '#33ffad'; //Verde
                break;
                
            case 5:
                color= '#ad33ff';//Morado
                break;
                
            default:
                color = 'white'; //Blanco por default
                break;
        }
        return {
          fillColor: color,
          strokeWeight: 1
        };
    });
}

botonTop3.onclick = function(){
    //Obtener el numero de crimenes por distrito
	for (var i = 0; i < Json_seguridad.length; i++) {
	    var ciudad = Json_seguridad[i].boro_nm;
	    switch(ciudad) {
            case 'QUEENS':
                queens.aumentarCrimenes();
                break;
                
            case 'MANHATTAN':
                manhattan.aumentarCrimenes();
                break;
                
            case 'BRONX':
                bronx.aumentarCrimenes();
                break;
                
            case 'STATEN ISLAND':
                statenIsland.aumentarCrimenes();
                break;
                
            case 'BROOKLYN':
                brooklyn.aumentarCrimenes();
                break;
                
            default:
                console.log('Salio otro distrito: ',ciudad)
                break;
        }
	}
	
	//Obtener las distancias entre el centro del distrito y la NYU 
	queens.distanciaNYU=calcularDistancia(queens.latitud,queens.longitud,40.7291,-73.9965);
	brooklyn.distanciaNYU=calcularDistancia(brooklyn.latitud,brooklyn.longitud,40.7291,-73.9965);
	manhattan.distanciaNYU=calcularDistancia(manhattan.latitud,manhattan.longitud,40.7291,-73.9965);
	bronx.distanciaNYU=calcularDistancia(bronx.latitud,bronx.longitud,40.7291,-73.9965);
	statenIsland.distanciaNYU=calcularDistancia(statenIsland.latitud,statenIsland.longitud,40.7291,-73.9965);
	
	//Obtener niveles de asequibilidad
	for (var i = 0; i < Json_asequibilidad.length; i++) {
	    var ciudad = Json_asequibilidad[i].borough;
	    var incremento = Json_asequibilidad[i].extremely_low_income_units;
	    if(incremento!=0){
	        switch(ciudad) {
                case 'Queens':
                    queens.aumentarCasas(incremento);
                    break;
                    
                case 'Manhattan':
                    manhattan.aumentarCasas(incremento);
                    break;
                    
                case 'Bronx':
                    bronx.aumentarCasas(incremento);
                    break;
                    
                case 'Staten Island':
                    statenIsland.aumentarCasas(incremento);
                    break;
                    
                case 'Brooklyn':
                    brooklyn.aumentarCasas(incremento);
                    break;
                    
                default:
                    console.log('Salio otro distrito: ',ciudad)
                    break;
            }    
	    }
	}
	queens.calcularAsequibilidad();
	manhattan.calcularAsequibilidad();
	bronx.calcularAsequibilidad();
	statenIsland.calcularAsequibilidad();
	brooklyn.calcularAsequibilidad();
	
	
	//Encabezado tabla
	var referenciarTabla = $("#tablaHeader")[0];
	var nuevaFila = referenciarTabla.insertRow(0);
	var nombreDistritos = nuevaFila.insertCell(0);
	var nCrimenes = nuevaFila.insertCell(1);
	var distanciaDistrito = nuevaFila.insertCell(2);
	var asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = 'NOMBRE DISTRITO';
	nCrimenes.innerHTML = 'N. crimenes';
	distanciaDistrito.innerHTML = 'Distancia a NYU (Km)';
	asequibilidadDistrito.innerHTML = 'Asequibilidad (%)';
	
	//Contenido fila queens
	referenciarTabla = $("#tablaBody")[0];
	nuevaFila = referenciarTabla.insertRow(referenciarTabla.rows.length);
	nombreDistritos = nuevaFila.insertCell(0);
	nCrimenes = nuevaFila.insertCell(1);
	distanciaDistrito = nuevaFila.insertCell(2);
	asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = queens.nombre;
	nCrimenes.innerHTML = queens.nCrimenes;
	distanciaDistrito.innerHTML = queens.distanciaNYU;
	asequibilidadDistrito.innerHTML = queens.asequibilidad;
	
	//Contenido fila manhattan
	referenciarTabla = $("#tablaBody")[0];
	nuevaFila = referenciarTabla.insertRow(referenciarTabla.rows.length);
	nombreDistritos = nuevaFila.insertCell(0);
	nCrimenes = nuevaFila.insertCell(1);
	distanciaDistrito = nuevaFila.insertCell(2);
	asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = manhattan.nombre;
	nCrimenes.innerHTML = manhattan.nCrimenes;
	distanciaDistrito.innerHTML = manhattan.distanciaNYU;
	asequibilidadDistrito.innerHTML = manhattan.asequibilidad;
	
	//Contenido fila brooklyn
	referenciarTabla = $("#tablaBody")[0];
	nuevaFila = referenciarTabla.insertRow(referenciarTabla.rows.length);
	nombreDistritos = nuevaFila.insertCell(0);
	nCrimenes = nuevaFila.insertCell(1);
	distanciaDistrito = nuevaFila.insertCell(2);
	asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = brooklyn.nombre;
	nCrimenes.innerHTML = brooklyn.nCrimenes;
	distanciaDistrito.innerHTML = brooklyn.distanciaNYU;
	asequibilidadDistrito.innerHTML = brooklyn.asequibilidad;
	
	//Contenido fila bronx
	referenciarTabla = $("#tablaBody")[0];
	nuevaFila = referenciarTabla.insertRow(referenciarTabla.rows.length);
	nombreDistritos = nuevaFila.insertCell(0);
	nCrimenes = nuevaFila.insertCell(1);
	distanciaDistrito = nuevaFila.insertCell(2);
	asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = bronx.nombre;
	nCrimenes.innerHTML = bronx.nCrimenes;
	distanciaDistrito.innerHTML = bronx.distanciaNYU;
	asequibilidadDistrito.innerHTML = bronx.asequibilidad;
	
	//Contenido fila statenIsland
	referenciarTabla = $("#tablaBody")[0];
	nuevaFila = referenciarTabla.insertRow(referenciarTabla.rows.length);
	nombreDistritos = nuevaFila.insertCell(0);
	nCrimenes = nuevaFila.insertCell(1);
	distanciaDistrito = nuevaFila.insertCell(2);
	asequibilidadDistrito = nuevaFila.insertCell(3);
	nombreDistritos.innerHTML = statenIsland.nombre;
	nCrimenes.innerHTML = statenIsland.nCrimenes;
	distanciaDistrito.innerHTML = statenIsland.distanciaNYU;
	asequibilidadDistrito.innerHTML = statenIsland.asequibilidad;
	
	
}