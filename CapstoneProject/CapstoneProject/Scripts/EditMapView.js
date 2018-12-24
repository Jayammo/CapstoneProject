
//used for annotations and for the map key
var labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var GSMurl; //holds the url for the static map
//Converts static map to data url and adds to pdf
function publishMap(url) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL('image/png');
        //console.log(dataURL);
        //var header = title.toString();
        var doc = new jsPDF('p', 'mm');
        doc.setFontSize(20);
        var MapTitle = $('#StaticMap').text();
        doc.text(35, 10, MapTitle);
        //addImage(data, format, horzontal space, vertical space, image width, image height)
        doc.addImage(dataURL, 'PNG', 10, 15);
        doc.setFontSize(10);
        var verticalSpace = 190;
        var pageHeight = doc.internal.pageSize.height;
        for (var i = 0; i < aMap.Annotates.length; i++) {
            var dat = aMap.Annotates[i].Description;
            var StartDate = aMap.Annotates[i].StartDate;
            var EndDate = aMap.Annotates[i].EndDate;
            if (EndDate == null || EndDate == "default") {
                //No end date
                doc.text(10, verticalSpace, labels[i] + ":" + dat + "\n Start Date: " + StartDate);
            } else {
                doc.text(10, verticalSpace, labels[i] + ":" + dat + "\n Start Date: " + StartDate + " End Date: " + EndDate);
            }
            verticalSpace += 10;
            //if need new page
            if (verticalSpace >= pageHeight) {
                doc.addPage();
            }
        }
        for (var j = 0; j < aMap.PolyLines.length; j++) {
            var dat = aMap.PolyLines[j].Description;
            var StartDate = aMap.PolyLines[j].StartDate;
            var EndDate = aMap.PolyLines[j].EndDate;
            if (EndDate == null || EndDate == "default") {
                //No end date
                doc.text(10, verticalSpace, "Road Closure: " + dat + "\n Start Date: " + StartDate);
            } else {
                doc.text(10, verticalSpace, "Road Closure: " + dat + "\n Start Date: " + StartDate + " End Date: " + EndDate);
            }
            verticalSpace += 10;
        }
        for (var k = 0; k < aMap.Circles.length; k++) {
            var dat = aMap.Circles[j].Description;
            var StartDate = aMap.Circles[j].StartDate;
            var EndDate = aMap.Circles[j].EndDate;
            if (EndDate == null || EndDate == "default") {
                //No end date
                doc.text(10, verticalSpace, "Circle: " + dat + "\n Start Date: " + StartDate);
            } else {
                doc.text(10, verticalSpace, "Circle: " + dat + "\n Start Date: " + StartDate + " End Date: " + EndDate);
            }
            verticalSpace += 10;
        }
        for (var l = 0; l < aMap.Boxes.length; l++) {
            var dat = aMap.Boxes[l].Description;
            var StartDate = aMap.Boxes[l].StartDate;
            var EndDate = aMap.Boxes[l].EndDate;
            if (EndDate == null || EndDate == "default") {
                //No end date
                doc.text(10, verticalSpace, "Box: " + dat + "\n Start Date: " + StartDate);
            } else {
                doc.text(10, verticalSpace, "Box: " + dat + "\n Start Date: " + StartDate + " End Date: " + EndDate);
            }
            verticalSpace += 10;
        }

        //Annotates[i].Description
        doc.save( MapTitle +'.pdf');
    };
    img.src = GSMurl;
}
//aMap.Circles.length, aMap.PolyLines.length, aMap.Annotates.length, aMap.Boxes.length
function ConvertToStatic() {
    //alert("test");
    //var soom = map.getZoom();
    //var cent = map.getCenter();
    //URL of Google Static Maps.
    var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
    //Set the Google Map Center.
    var latitude = map.getCenter().lat();
    var longitude = map.getCenter().lng();
    //staticMapUrl += "?center=" + aMap.Lat + "," + aMap.Lng;
    staticMapUrl += "?center=" + latitude + "," + longitude;
    //Set the Google Map Size.
    staticMapUrl += "&size=300x300";
    //Set the Google Map Zoom
    //Randomly zoomed in by 1 level further than the actual view so needs to be subtracted by 1
    var zoomLevel = map.getZoom() - 1; 
    staticMapUrl += "&zoom=" + zoomLevel; 
    //Set the Google Map scale.
    staticMapUrl += "&scale=2"; //Double the resolution for better viewing
    //Set the Google Map Type. Would be set to default, will remove this by monday
    //staticMapUrl += "&maptype=" + aMap.mapTypeId;
    //Loop and add Markers.
    var loop = 0;
    for (var i = 0; i < aMap.Annotates.length; i++) {
        console.log(" anontate" + aMap.Annotates[i].Lat + "," + aMap.Annotates[i].Lng);
        //Need error if i > 36, because it'll out of range labels
        if (i > 36) {
            staticMapUrl += "&markers=color:red|label:" + labels[loop] + "|" + aMap.Annotates[i].Lat + "," + aMap.Annotates[i].Lng;
            loop++;
            if (loop == 37) {
                loop = 0;
            }
        } else {
            staticMapUrl += "&markers=color:red|label:" + labels[i] + "|" + aMap.Annotates[i].Lat + "," + aMap.Annotates[i].Lng;
        }
    }
    //path, works
    for (var i = 0; i < aMap.PolyLines.length; i++) {
        staticMapUrl += "&path=color:0x0000ff|weight:5";
        console.log(aMap.PolyLines[i].Path);
        staticMapUrl += "|enc:" + aMap.PolyLines[i].Path;
    }

    //Circle, Works. 
    var circumLatLng;
    for (var k = 0; k < aMap.Circles.length; k++) {
        staticMapUrl += "&path=fillcolor:0xAA000033";
        var myCenter = new google.maps.LatLng({ lat: aMap.Circles[k].Lat, lng: aMap.Circles[k].Lng });
        for (var j = 0; j < 361; j = j + 8) {
            console.log("Circle " + k + ":" + aMap.Circles[k].Center + " Radius:" + aMap.Circles[k].Radius);
            circumLatLng = google.maps.geometry.spherical.computeOffset(myCenter, aMap.Circles[k].Radius, j);
            staticMapUrl += '|' + circumLatLng.lat().toFixed(6) + ',' + circumLatLng.lng().toFixed(6);
        }
    }
    //Box, works
    for (var l = 0; l < aMap.Boxes.length; l++) {
        staticMapUrl += "&path=fillcolor:0xAA000033";
        var TL = aMap.Boxes[l].SouthWestLat + "," + aMap.Boxes[l].NorthEastLng; //Top left corner
        var TR = aMap.Boxes[l].NorthEastLat + "," + aMap.Boxes[l].NorthEastLng; //Top right corner
        var BL = aMap.Boxes[l].SouthWestLat + "," + aMap.Boxes[l].SouthWestLng; //Bottom left corner
        var BR = aMap.Boxes[l].NorthEastLat + "," + aMap.Boxes[l].SouthWestLng; //Bottom right corner
        staticMapUrl += "|" + TL + "|" + TR + "|" + BR + "|" + BL + "|" + TL;
    }
    staticMapUrl += "&key=AIzaSyBEoaPhOH6jF15XoBRvGGuG_bu_-QLYuPU";
    GSMurl = staticMapUrl;
    console.log(GSMurl);

}
function runPublish() {
    saveMap();
    ConvertToStatic();
    publishMap(GSMurl);
}

var map;
var selectedShape;
var mapId;
var lineIndex = 0;
var circleIndex = 0;
var rectangleIndex = 0;
var annotationIndex = 0;
var drawingManager;
var aMap;
var UserId;
var geocoder;
var infowindow;
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; 
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = mm + '/' + dd + '/' + yyyy;

var count = 0;
var circle = "Circle";
var box = "Box";
var line = "PolyLine";



//Contructor for Annotate Marker
var Annotate = function (mLat, mLng, mStartDate, mEndDate, mDescription) {
    return {
        Lat: mLat,
        Lng: mLng,
        StartDate: mStartDate,
        EndDate: mEndDate,
        Description: mDescription,
    }
}
//Contructor for Circle Object
var Circle = function (mLat, mLng, mRadius, mStartDate, mEndDate, mDescription) { 
    return {
        lat: mLat,
        lng: mLng,
        radius: mRadius,
        StartDate: mStartDate,
        EndDate: mEndDate,
        Description: mDescription,
        }
}
//Contructor for Box object
var Box = function(mNorthEastLat, mNorthEastLng, mSouthWestLat, mSouthWestLng, mStartDate, mEndDate, mDescription)
{
    return {
        NorthEastLat: mNorthEastLat,
        NorthEastLng: mNorthEastLng,
        SouthWestLat: mSouthWestLat,
        SouthWestLng: mSouthWestLng,
        StartDate: mStartDate,
        EndDate: mEndDate,
        Description: mDescription,
    }
}
//Constructor for Line Object
var Line = function (mStartDate, mEndDate, mDescription, mPath) {
    return {
        StartDate: mStartDate,
        EndDate: mEndDate,
        Description: mDescription,
        Path: mPath,
    };
};
var formStr = "<input type='text' id='text4mrkr' value='marker text' /><input type='button' onclick='addPlace()' value='submit' />";


function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            //center: { lat: 33.4735, lng: -82.0105  },
            //zoom: 8
        });
        infowindow = new google.maps.InfoWindow({
            content: formStr
        });
        drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,

        });
        drawingManager.setMap(map);
        
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            console.log(e.overlay);
            if (e.type == 'polyline') {
                var path = e.overlay.getPath();
                var encodeString = google.maps.geometry.encoding.encodePath(path);
                var savedLine = Line(today, "default", line + "-" + e.overlay.id, encodeString);
                populateTable(savedLine, "Line",e.overlay.id)
                aMap["PolyLines"][e.overlay.id] = (savedLine);
                count++;
                
            };
            if (e.type == 'circle') {
                var circleRadius = e.overlay.getRadius();
                var circleCenter = e.overlay.getCenter();
                var circleLng = circleCenter.lng();
                var circleLat = circleCenter.lat();
                var savedCircle = Circle(circleLat, circleLng, circleRadius, today, "default", circle + "-" + e.overlay.id);
                populateTable(savedCircle, "Circle", e.overlay.id);
                aMap["Circles"][e.overlay.id] = savedCircle;
                count++;
                 
            }
            if (e.type == 'rectangle') {
                var rectBounds = e.overlay.getBounds();
                var NorthEast = rectBounds.getNorthEast();
                var SouthWest = rectBounds.getSouthWest();
                var NorthEastLat = NorthEast.lat();
                var NorthEastLng = NorthEast.lng();
                var SouthWestLat = SouthWest.lat();
                var SouthWestLng = SouthWest.lng();
                var savedrectangle = Box(NorthEastLat, NorthEastLng, SouthWestLat, SouthWestLng, today, "default", box + "-" + e.overlay.id);
                populateTable(savedrectangle, "Box", e.overlay.id);
                aMap["Boxes"][e.overlay.id] = (savedrectangle);
                count++;

            }
            if (e.type != google
                .maps.drawing.OverlayType.MARKER) {
                drawingManager.setDrawingMode(null);

                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape, 'click', function () {
                    setSelection(newShape);
                });
                setSelection(newShape);
            };
            console.log("Map Object:");
            console.log(aMap);


        });
}

function addPlace() {
    var marker = new google.maps.Marker({
        map: map,
        position: infowindow.getPosition(),
        id:count
    });
    marker.htmlContent = document.getElementById('text4mrkr').value;
    infowindow.close();
    var positionMarker = marker.getPosition();
    var markerlat = positionMarker.lat();
    var markerlng = positionMarker.lng();
    var annotate1 = Annotate(markerlat, markerlng, today, "default", marker.htmlContent);
    populateTable(annotate1,"Annotate")
    aMap["Annotates"][marker.id] = (annotate1);
    google.maps.event.addListener(marker, 'click', function (evt) {
        infowindow.setContent(this.htmlContent);
        infowindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'click', function () {
        this.setMap(null);
        aMap["Annotates"].splice(marker.id, 1);
        removeMarkerRow(marker.id, "marker");

    });
}

//creates a Table Row with Marker Data
function populateTable(object, Type, Id) {
    $("#myTable > tbody").append("<tr id="+Id+"><td contenteditable=\"false\">" + Type + "</td><td contenteditable=\"false\">" + object.StartDate + "</td><td contenteditable=\"false\">" + object.EndDate + "</td><td contenteditable=\"false\">" + object.Description + "</td><td><button class=\"btn btn-primary\" id=\"editBtn"+Type+Id+"\" onclick=\"editTable("+Type + Id +")\">Edit</button></td></tr>");
    
}

//function that makes the rows editable on button click
function editTable(Type,id) {
    var currentRow = $('#' + id + '');
    var currentTD = $("#editBtn"+ Type + id + "").parents('tr').find('td');
    if ($("#editBtn" + Type + id + "").html() == 'Edit') {
        var col2 = currentRow.find("td:eq(1)").prop('contenteditable', true);
        var col3 = currentRow.find("td:eq(2)").prop('contenteditable', true);
        var col4 = currentRow.find("td:eq(3)").prop('contenteditable', true);
        $("#editBtn"+ Type + id + "").text('Save');

    }
    else {
        $.each(currentTD, function () {
            $(this).prop('contenteditable', false)
        });
        saveNewData(currentRow, id);
        $("#editBtn"+ Type + id + "").text('Edit');
    };
};

//saves the new data to the Map object once savebutton is pressed
function saveNewData(row, id, type) {
    var markerType = row.find("td:eq(0)").text();
    var newData2 = row.find("td:eq(2)").text();
    var newData3 = row.find("td:eq(3)").text();
    var newData4 = row.find("td:eq(4)").text();
    var annotateData1 = row.find("td:eq(1)").text();
    var annotateData2 = row.find("td:eq(2)").text();
    var annotateData3 = row.find("td:eq(3)").text();

    if (markerType == "Circle") {
        aMap["Circles"][id]["StartDate"] = newData2;
        aMap["Circles"][id]["EndDate"] = newData3;
        aMap["Circles"][id]["Description"] = newData4;
    }
    if (markerType == "Box") {
        aMap["Boxes"][id]["StartDate"] = newData2;
        aMap["Boxes"][id]["EndDate"] = newData3;
        aMap["Boxes"][id]["Description"] = newData4;
    }
    if (markerType == "Line") {
        aMap["PolyLines"][id]["StartDate"] = newData2;
        aMap["PolyLines"][id]["EndDate"] = newData3;
        aMap["PolyLines"][id]["Description"] = newData4;
    }
    if (markerType == "Annotate") {
        aMap["PolyLines"][id]["StartDate"] = annotateData1;
        aMap["PolyLines"][id]["EndDate"] = annotateData2;
        aMap["PolyLines"][id]["Description"] = annotateData3;
    }



}

//removes shape from map
function eraseMarker() {
    deleteSelectedShape();
    var selectedShapeType = selectedShape.type;
    removeMarkerRow(selectedShape.id, selectedShapeType);
}

//removes Row for the Marker erased
function removeMarkerRow(id, markerType) {
    var table = $("#myTable > tbody");
    var row = $('#' + id + '');
    $('#' + id + '').remove();
    if (markerType == "circle") {
        aMap["Circles"].splice(id,1);
    }
    if (markerType == "rectangle") {
        aMap["Boxes"].splice(id,1);
    }
    if (markerType == "polyline") {
        aMap["PolyLines"].splice(id,1);
    }
    if (markerType == "marker") {
        aMap["Annotates"].splice(id,1);
    }
}

function deleteSelectedShape() {
    if (selectedShape) {
        selectedShape.setMap(null);
    }
}

function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(true);
}

function clearSelection() {
    if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
    }
}

//saves Map to Server
function saveMap() {
    $('#saveBtn').text('Saving...');
    $('#saveBtn').prop("disabled", true);
    aMap.Lat = map.getCenter().lat();
    aMap.Lng = map.getCenter().lng();
    aMap.Zoom = map.getZoom();
    var data = JSON.stringify(aMap);
    $.ajax({
        type: "POST",
        data: data,
        url: '/Home/Create',
        contentType: "application/json",
        success: function (data) {
            $('#saveBtn').prop("disabled", false);
            $('#saveBtn').html('<span class="glyphicon glyphicon-floppy-disk"></span> Save Map');
        }
    });
}

//function to draw annotation pin
function drawAnnotate() {

    google.maps.event.addListener(map, 'click', function (e) {
        infowindow.setContent(formStr);
        infowindow.setPosition(e.latLng);
        infowindow.open(map);
    });
}

//sets DrawingManager to Polyline
function drawLine() {
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    drawingManager.setOptions({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYLINE]
        },
        polylineOptions: {
            editable: true,
            id: count,
        }
    });
}

//sets DrawingManager to Circle
function drawCircle() {

        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        drawingManager.setOptions({
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [google.maps.drawing.OverlayType.CIRCLE]
            },
            circleOptions: {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            id: count,
            }
        });
}
//sets DrawingManager to Rectangle
function drawRectangle() {

    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    drawingManager.setOptions({
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.RECTANGLE]
        },
        rectangleOptions: {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            id: count,
        }
    });
}


//Checks for geo Location
if (navigator.geolocation) {
    //gets geo Location
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        //sets geo Location
        map.setCenter(pos);
        map.setZoom(15);
    }, function () {
        handleLocationError(true, map.getCenter());
    });
} else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
}


//Getting MapId
var id = document.getElementById("mapId").innerText;

//Getting JSON MapObject from Server Jay's Code
$.post("/Home/GetMapAjax", { id : id }).done(function (data) {
   
    var Map = $.parseJSON(data);
    //console.log(Map.Annotates.length);
    aMap = $.extend({}, Map);

    aMap.Zoom = map.zoom;
    var mapCenter = map.getCenter();
    var mapLng = mapCenter.lng();
    var mapLat = mapCenter.lat();
    aMap.Lng = mapLng;
    aMap.Lat = mapLat;
    
    //Setting the Map Properties
    if (Map.Lat !== null && Map.Lng !== null) {
        map.setCenter({lat: Map.Lat, lng: Map.Lng});
        map.setZoom(Map.Zoom);
    }
   
    //creating loop for map marker objects
    //Maximum times to loop
    var Loop = Math.max(Map.Circles.length, Map.PolyLines.length, Map.Annotates.length, Map.Boxes.length);
   
    for (var count = 0; count < Loop; count++) {
        if (count < Map.Circles.length) {
            var latLng = new google.maps.LatLng({ lat: Map.Circles[count].Lat, lng: Map.Circles[count].Lng });
               
            var myCircle = new google.maps.Circle({
                strokeOpacity: 0.8,
                strokeWeight: 2,
                editable: true,
                draggable: true,
                clickable: true,
                fillOpacity: 0.35,
                map: map,
                center: latLng,
                radius: Map.Circles[count].Radius
            });
            
        }

        if (count < Map.Annotates.length) {
            latLng = { lat: Map.Annotates[count].Lat, lng: Map.Annotates[count].Lng }
           
            var myAnnotate = new google.maps.InfoWindow;
            myAnnotate.setPosition(latLng);
            myAnnotate.setContent(Map.Annotates[count].Description);
            myAnnotate.open(map);
            
        }

        if (count < Map.Boxes.length) {
            var swCorner = new google.maps.LatLng({ lat: Map.Boxes[count].SouthWestLat, lng: Map.Boxes[count].SouthWestLng });
            var neCorner = new google.maps.LatLng({ lat: Map.Boxes[count].NorthEastLat, lng: Map.Boxes[count].NorthEastLng });
            var myBounds = new google.maps.LatLngBounds(swCorner, neCorner);
            var myBox = new google.maps.Rectangle({
                bounds: myBounds,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                editable: true,
                draggable: true,
                clickable: true,
                fillOpacity: 0.35,
                map: map
            });
          
        }
        
        if (count < Map.PolyLines.length) {
            var myPath = google.maps.geometry.encoding.decodePath(Map.PolyLines[count].Path);
            
            var myPolyLine = new google.maps.Polyline({
                path: myPath,
                editable: true,
                draggable: true,
                clickable: true,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0.35,
                visible: true,
                map: map
            });
           
        }
        
        
    }

    
});