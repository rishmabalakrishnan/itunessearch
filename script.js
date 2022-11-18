const { createApp } = Vue
var audio = null;
var playIndex = 0;
createApp({
  data() {
    return {
      artist1: './img/1.jpg',
      artist2: './img/2.jpg',
      imgURL: '',
      search: '',
      numResults: 0,
      shownResults: 0,
      results: [],
      newResults: [],
      genres: new Set(),
      genresClicked: [],
        isActive: false,
        isReset: false,
        isSortByColl: false,
        isSortByPrice: false
    }
  },
  methods: {
    parseSearch:function() {
      this.results = [];
      this.genres = new Set();
      this.genresClicked = [];
      this.clicked = false;
          this.isActive = true;
          this.isReset = true;
      encodedSearch = encodeURIComponent(this.search);
      fetch(`https://itunes.apple.com/search?term=` + encodedSearch + `&limit=50&attribute=allArtistTerm&origin=*`).then(res => res.json())
      .then((result) => {
        // Print out the returned json object in the console
       console.log(result);
        var i = 0;
        result.results.forEach(element => {
          this.results.push({"artistName": element.artistName,
          "collectionName": element.collectionName,
          "price": element.collectionPrice,
          "kind": element.kind,
          "preview": element.previewUrl,
          "img": element.artworkUrl100, 
          "trackID": element.trackId, 
          "country": element.country, 
          "genre": element.primaryGenreName,
          "index": i,
          "descriptionIndex": "#description" + i,
          "trackIndex": "#track" + i,
          "descriptionDivID": "description" + i,
          "isPlaying": false,
//          "audio": new Audio(element.previewUrl),
          "trackDivID": "track" + i});
          this.genres.add(element.primaryGenreName);
          i++;
        });
        // console.log(this.genres);
        clickedIndex = 0;
        this.genres.forEach(element => {
          this.genresClicked.push(
            {"genre": element,
            "clicked": false,
            "index": clickedIndex}
            
          );
          clickedIndex++;
        });
        // console.log("genresClicked");
        // console.log(this.genresClicked);
        this.newResults = JSON.parse(JSON.stringify(this.results));
        if (result.resultCount == 0) {
          alert("No artist was found");
        }
        this.numResults = result.resultCount;
        this.shownResults = this.numResults;
      })
    },
    selectAll() {
      this.isActive = !this.isActive;
      this.genresClicked.forEach(element => {
        element['clicked'] = false;
      });
      this.shownResults = this.numResults;
    },
    toggle(index) {
      this.isActive = false;
      this.shownResults = 0;
      // console.log(index);
      var button = this.genresClicked[index];
      button['clicked'] = !button['clicked'];
      if (button['clicked']) {
        this.isActive = false;
      }
      this.genresClicked.forEach(element => {
        if (element.clicked == true) {
          this.newResults.forEach(el => {
            if (element.genre == el.genre) {
              this.shownResults++;
            }
          });
        }
      });
    },
    showResult(elementIndex) {
      if (this.isActive) {
        return true;
      }
      var display = false;
      this.newResults.forEach(element => {
        if (element['index'] == elementIndex) {
          this.genresClicked.forEach(genreClicked => {
            if (genreClicked['clicked'] && element['genre'] == genreClicked['genre']) {
              // console.log("true");
              display = true;
            }
          });
        }
      });
      // console.log(display);
      return display;
      },
      play(index) {
          // console.log(this.newResults[index].preview);
          if (audio) {
              audio.pause();
              this.newResults[playIndex].isPlaying = false;
          }
          this.newResults[index].isPlaying = true;
          playIndex = index;
          audio = new Audio(this.newResults[index].preview);
          audio.play();
      },
      stop(index) {
          if (!audio) {
              return;
          }
          // console.log(this.newResults[index].preview);
          this.newResults[index].isPlaying = false;
          audio.pause();
      },
      reset() {
          // console.log('Reset');
          this.isReset = true;
          this.isSortByColl = false;
          this.isSortByPrice = false;
           this.newResults.sort((a, b) => a.index - b.index);
          // console.log(this.newResults);
    },
      sortByCollection() {
          // console.log('Sort by collection');
          this.isReset = false;
          this.isSortByColl = true;
          this.isSortByPrice = false;
            this.newResults.sort((a, b) => {
            collectionA = a.collectionName;
            collectionB = b.collectionName;
        if (collectionA < collectionB) {
          return -1;
        }
        if (collectionA > collectionB) {
          return 1;
        }
        return 0;
            });
          // console.log(this.newResults);
    },
      sortByPrice() {
          // console.log('sort by price');
          this.isReset = false;
          this.isSortByColl = false;
          this.isSortByPrice = true;
            this.newResults.sort((a,b) => a.price - b.price);
          //  console.log(this.newResults);
    }
  }
}).mount('#app')