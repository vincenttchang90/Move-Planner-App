
function loadData() {

    // clear out old data before new request
    $('#wikipedia-links').text("");
    $('#nytimes-articles').text("");
    $('.bgimg').remove();

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $('#street').val();
    console.log(street);

    var city = $('#city').val();
    console.log(city);

    var google = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    console.log(google);

    var webAddress = "'" + google + street + ", " + city + "'";
    console.log(webAddress);

    var caps = function(string) {
        var words = string.toLowerCase().split(" ");
        var stuff = "";
        words.forEach(function(word) {
            var string = word.charAt(0).toUpperCase() + word.slice(1) + " ";
            stuff += string;
        })
        string = stuff.slice(0, -1);
        return string
}

    city = caps(city);
    street = caps(street);

    $('body').append("<img class='bgimg' src="+webAddress+">");
    $("#greeting").text("So, you want to live at " + street + ", " + city + "?");

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "31bdfe9d100041a4bb62cc5602f88370",
      'q': city
    });
    $.ajax({
      url: url,
      method: 'GET',
    }).error(function() {
        $('#nytimes-header').text("New York Times Acticles Count Not be Loaded")
    }).done(function(result) {
        console.log(result);
      result.response.docs.forEach(function(story) {
        var storyLink = story.web_url;
        $("#nytimes-header").text("New York Times Articles about " + city);
        $("#nytimes-articles").append("<li class='article'>" + "<a href=" + storyLink + ">" + story.headline.main + "</a><p>"+ story.snippet + "</p></li>");
    });
    }).fail(function(err) {
      throw err;
    });

    var wikiRequestTimeout = setTimeout(function(){
        $("#wikipedia-links").text("failed to get wikipedia resources");
    }, 8000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response){
            console.log(response);
            for (var i = 0; i < response[1].length; i++){
                $('#wikipedia-links').append("<li><a href="+ response[3][i] +">"+ response[1][i] +"</a></li>")
            }
            clearTimeout(wikiRequestTimeout);
        }
    });














    return false;
};

$('#form-container').submit(loadData);
