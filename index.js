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
    }
    get nombre(){return this._nombre;}
    get latitud(){return this._latitud;}
    get longitud(){return this._longitud;}
    get nCrimenes(){return this._nCrimenes;}
    get distanciaNYU(){return this._distanciaNYU;}
    get asequibilidad(){return this._asequibilidad;}
    
    aumentarCrimenes(){
        this._nCrimenes++;
    }
    
    set distanciaNYU(distanciaIngresada){
        this._distanciaNYU=distanciaIngresada;
    }
    
    set asequibilidad(asequibilidadIngresada){
        this._asequibilidad=asequibilidadIngresada;
    }
    
}


                    /*Arreglos para utilizar datos de JSON
____________________________________________________________________________*/
var Json_seguridad = [];


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

                /*Carga de archivos JSON e inicialización de variables
____________________________________________________________________________*/
$(function(){
    
    //Datos de seguridad
	url ='https://data.cityofnewyork.us/resource/9s4h-37hy.json';
	$.getJSON(url, function(data){
		$.each(data,function(i,entrada){
			Json_seguridad.push(entrada);
		});
		console.log('Datos de seguridad cargados');
	});
	
});

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
                console.log('Salio otro distrito: ',numeroCiudad)
                break;
        }
	}
	
	//Obtener las distancias entre el centro del distrito y la NYU 
	var distancia = new google.maps.DistanceMatrixService();
    distancia.getDistanceMatrix(
      {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: 'DRIVING',
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
      }, callback);
    
    function callback(response, status) {
      // See Parsing the Results for
      // the basics of a callback function.
    }
}