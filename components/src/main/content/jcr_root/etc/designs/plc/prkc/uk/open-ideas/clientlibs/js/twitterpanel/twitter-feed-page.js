(function($) {

    /***********************************************
     *
     *  Script used for consuming json from sling servlet (returning all tweets based on twitter accounts) .
     *
     *  tweets = the div area where the tweets will be appended.
     *  twitterAccounts = all twitter accounts that have be assigned to the panel, using cq5 widget dialog
     *  maxTweetcount = the maximim number of latest tweets to be displayed in the panel.
     *
     *
     ***********************************************/


    $(function() {

        var tweets = $("#twitter-feed-container");
        var twitterAccounts = tweets.attr("data-twitter-accounts");
        var maxTweetcount = tweets.attr("data-tweet-count");

        if(typeof(twitterAccounts) != 'undefined' && twitterAccounts.length > 0 ) {
            var arrayTwitterAccounts = twitterAccounts.split(",");

            $.ajax({
                url: '/bin/twitterServlet',
                data: {arrayTwitterAccounts : arrayTwitterAccounts, maxTweetcount: maxTweetcount},
                dataType: 'json',
                async: false,
                success: function(data) {

                    $(".loading-twitter-pannel", tweets).remove();
                    var rescount = data['results'].length;

                    var html = "<div id='all-articles-marquee'>";
                    if (rescount === 0) {
                        var text = "No tweets found for the current accounts";
                        html += "<div class='twitter-no-results-found'>";
                        html += text;
                        html += "</div>";
                    }
                    for (var res = 0 ; res < rescount; res++) {
                        var result = data['results'][res];
                        var text = result['text'];
                        var from_user = result['user']['name'];
                        var user_screenName = result['user']['screenName'];
                        var created_at = $.timeSinceTweet(result['createdAt']);
                        var id_str = result['id'];
                        var profile_image_url = result['user']['profileImageUrl'];

                        //Tidy up the text by adding hyperlinks and the date posted
                        text = text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>')
                            .replace(/(^|\s)@(\w+)/g,'$1<a href="http://twitter.com/$2">@$2</a>');

                        text = text + '<br /><a href="http://www.twitter.com/' + user_screenName + '/status/' + id_str + '" class="datelink" target="_blank">' + created_at + '</a>';
                        html += "<div class='twitter-article'>";
                            html += "<div class='header-article'>";
                                html += "<img src=\"" + profile_image_url + "\" alt=\"" + user_screenName + " avatar\" />"
                                html += "<div class='twitter-name'>" + from_user + "</div><br>";
                                html += "<div class='twitter-screen-name'>" + "@" + user_screenName + "</div>";
                                html += "<div class='twitter-image'><img class='twitter-logo-src' src='/etc/designs/plc/prkc/uk/open-ideas/clientlibs/img/twitter_logo_icon.jpeg'></div>";
                            html += "</div>";
                            html += "<p class='twitter-paragraph'>" + text +"</p>";
                        html += "</div>";
                    }

                    html += "</div>";
                    tweets.append(html);
                }
            });
        }
    });
})($CQ || $);

/***********************************************
 *
 *  Returns time in hh:mm:ss if tweet was today, otherwise returns date and time if tweet was before today.
 *
 *  time = the date tweet was posted
 *
 *
 *
 ***********************************************/

(function($) {
    $.timeSinceTweet = function(time) {

        var date = new Date(time);
        var diff = ((new Date()).getTime() - date.getTime()) / 1000;
        var day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff)){
            return "View tweet";
        }

        else if (new Date().toDateString() === date.toDateString()) {
            var hours = date.getHours();
            var minutes =  date.getMinutes();
            var seconds = date.getSeconds();
            var mid = "AM";

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            else if (hours == 0) {
                hours = "12";
            }
            else if (hours > 12) {
                hours = hours % 12;
                mid = "PM";
            }
            return hours + ":" + minutes + ":" + seconds + " " + mid;
        }
        else {
            return date.toDateString();
        }
    }
})($CQ || $);