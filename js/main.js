var map;
var largeInfowindow;
var markers = [];
//Defining location values
var locations = [{
    title: 'Hotel Janatha Deluxe',
    location: {
      lat: 12.872588,
      lng: 74.842555
    },
    id: 0,
    venueId: '50d6b983e4b02e407d8bca04'
  },
  {
    title: 'Brio Cafe & Grill',
    location: {
      lat: 12.872311,
      lng: 74.844991
    },
    id: 1,
    venueId: '56559512498edc3a6c00f6d7'
  },
  {
    title: 'The Liquid Lounge',
    location: {
      lat: 12.870639,
      lng: 74.846758
    },
    id: 2,
    venueId: '4bbdf550f57ba59370acaeb9'
  },
  {
    title: 'Punjab da Pind',
    location: {
      lat: 12.869857,
      lng: 74.841675
    },
    id: 3,
    venueId: '55674412498efa7eb5b8d5fd'
  },
  {
    title: 'The Kudla Cafe',
    location: {
      lat: 12.872803,
      lng: 74.849787
    },
    id: 4,
    venueId: '4e6cc3ad45dd435bc12af9f7'
  },
  {
    title: 'City Center',
    location: {
      lat: 12.871339,
      lng: 74.842598
    },
    id: 5,
    venueId: '4bc691c2d35d9c741a06e33a'
  },
  {
    title: 'Sapna Book Mall',
    location: {
      lat: 12.869718,
      lng: 74.841665
    },
    id: 6,
    venueId: '4f0418dfa69d5515ac8c4576'
  }
];

//Initialising map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 12.874691,
      lng: 74.850296
    },
    zoom: 15,
    mapTypeControl: false
  });

  largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  fsContent = null;


  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;

    var venueId = locations[i].venueId;
    var fsURL = "https://api.foursquare.com/v2/venues/" + venueId + "?&client_id=10KEF4ZPDY1PJA5PORLY0QVGITMHQAYUTGZ3ZIBZ1H1XUIA0&client_secret=I20A2ELOQ5Y5YPRMMJJG4TLP3UENN1TS0P24XPSFV1XGCB0R&v=20161016";


    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      id: fsURL
    });
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);

    });
    bounds.extend(markers[i].position);
  }
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  map.fitBounds(bounds);
}

//Inserting place title and photos from four square in markers when clicked
function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div id="details"><h3>' + marker.title + '</h3></div>');
    var fsURL = marker.id;
    if (!fsContent) {
      var initContent = infowindow.getContent();
      var loadContent = initContent + '<div id="fsPhotos"><p>LOADING</p></div>';
      infowindow.setContent(loadContent);
      $.ajax({
        url: fsURL,
        dataType: 'json',
        success: function(data) {
          infowindow.setContent(initContent);
          var updatedContent = initContent + '<div class="fsPhotos">';
          updatedContent = updatedContent + '<p>Photos from FourSquare</p>';
          var fsURL = data.response.venue.canonicalUrl;
          var photo = data.response.venue.photos.groups[0].items;
          for (var i = 0; i < 2; i++) {
            updatedContent = updatedContent + '<div class="fs-photo"><a target="_blank" href="' + fsURL + '"><img src="' + photo[i].prefix + '50x50' + photo[i].suffix + '"></a></div>';
          }
          updatedContent = updatedContent + '</div>';
          infowindow.setContent(updatedContent);
        },
        error: function() {
          var dispMessage = '<h3>Photos cannot be fetched from FourSquare at this moment</h3>';
          infowindow.setContent(dispMessage);
        }
      });
    }
    infowindow.open(map, marker);
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    });
  }
}
window.onload = function() {
  function updateMarkers(list) {
    console.log(list.length);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    for (var i = 0; i < list.length; i++) {
      console.log(list[i].title);
      markers[list[i].id].setMap(map);
    }
  }

//Observable values being handled by view-model function using knockout
  function MyViewModel() {
    var self = this;
    self.searchbar = ko.observable('');
    self.placeList = ko.observableArray([]);
    locations.forEach(function(item) {
      self.placeList.push(item);
    });
    self.placeListClone = self.placeList;
    //Filtering list based on search by using filtering an array using ko
    //Attribution: (http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
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

    updateMarker = this.searchbar().toLowerCase();
    self.updateMarker = ko.computed(function() {
      if (!updateMarker) {
        updateMarkers(new self.placeListClone);
      } else if (updateMarker) {
        updateMarkers(new self.placeListClone);
      }
    });

    self.giveInfo = function(place) {
      markers[place.id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      populateInfoWindow(markers[place.id], largeInfowindow);
    };

    var stringStartsWith = function(string, startsWith) {
      string = string || "";
      if (startsWith.length > string.length)
        return false;
      return string.substring(0, startsWith.length) === startsWith;
    };

  }
  ko.applyBindings(new MyViewModel());
};