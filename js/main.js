

var map;
var largeInfowindow;
      var markers = [];
      var locations = [
      {title:'Hotel Janatha Deluxe', location: {lat: 12.872588, lng:74.842555}, id:0},
      {title:'Brio Cafe & Grill', location: {lat: 12.872311, lng:74.844991}, id:1},
      {title:'The Liquid Lounge', location: {lat: 12.870639, lng:74.846758}, id:2},
      {title:'Pallaki Resturant', location: {lat: 12.872216, lng:74.848437}, id:3},
      {title:'The Kudla Cafe', location: {lat: 12.872803, lng:74.849787}, id:4},
      {title:'City Center', location: {lat: 12.871339, lng:74.842598}, id:5},
      {title:'Sapna Book Mall', location: {lat: 12.869718, lng:74.841665}, id:6}
    ];

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'),
        {
          center: {lat: 12.873330, lng:74.846743},
          zoom: 14,
          mapTypeControl: false
        });

        largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();


        for(var i=0;i<locations.length;i++){
            var position = locations[i].location;
            var title = locations[i].title;

            var marker= new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                id: i
            });
            markers.push(marker);
            marker.addListener('click', function(){
                populateInfoWindow(this, largeInfowindow);

            });
            bounds.extend(markers[i].position);
        }
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        map.fitBounds(bounds);
        }

        function populateInfoWindow(marker, infowindow){
            if(infowindow.marker != marker){
                infowindow.marker = marker;
                infowindow.setContent('<div>'+ marker.title +'</div>');
                infowindow.open(map, marker);
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                infowindow.addListener('closeclick',function(){
                    infowindow.marker=null;
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
                });
            }
        }
        window.onload = function () {
        function updateMarkers(list){
          console.log(list.length);
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          };
        for(var i=0;i<list.length;i++){
          console.log(list[i].title);
          markers[list[i].id].setMap(map);
        }
      }

      /* $()*/
      /*  function showListings() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }*/

      /*var stringStartsWith = function (string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
          return false;
          return string.substring(0, startsWith.length) === startsWith;
        };*/

      function MyViewModel() {
        var self = this;
          self.searchbar = ko.observable('');
          self.placeList = ko.observableArray([]);
          locations.forEach(function(item){
            self.placeList.push(item);
          });
          self.placeListClone = self.placeList;
          self.placeListClone = ko.computed(function() {
            var filter = this.searchbar().toLowerCase();
            if (!filter) {
              return this.placeList();
            } else {
              return ko.utils.arrayFilter(this.placeList(), function(item) {
                return stringStartsWith(item.title.toLowerCase(), filter);
              });
            }
          }, self);
          /*markers[2].setMap(null);*/

        updateMarker = this.searchbar().toLowerCase();
        self.updateMarker = ko.computed(function(){
          if(!updateMarker){
          updateMarkers(new self.placeListClone);
        }else if(updateMarker){
          updateMarkers(new self.placeListClone);
        }
      });

      self.giveInfo = function(place){
        markers[place.id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        populateInfoWindow(markers[place.id], largeInfowindow);
      };

          var stringStartsWith = function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
              return false;
              return string.substring(0, startsWith.length) === startsWith;
              };

      }
      ko.applyBindings(new MyViewModel());
}
