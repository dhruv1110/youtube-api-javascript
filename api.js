/**********************************************************************
Copyright 2015 Dhruv Patel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***********************************************************************/
function youtube(){
	/*
	 * data members
	 */
	var yt_domain_url = "https://www.youtube.com/";
	var yt_channel_url = yt_domain_url + "channel/";
	var yt_video_url = yt_domain_url + "watch?v=";
	var yt_embed_url = yt_domain_url + "embed/";
	var yt_privacy_embed_url = "https://www.youtube-nocookie.com/embed/";
	var yt_api = "";
	var api_init = false;
	
	/* Function for getting embed URL of any video
	 * @param url : URL of video
	 * @return : URL of embed video
	 */
	getEmbedVideoUrl = function(url){
		return youtube.yt_embed_url + youtube.getIdByUrl(url);
	}
	
	/* Function for getting YouTube embed player HTML by various configuration
	 * @param url : URL of video
	 * @param isDisplaySuggestedVideo : default argument set to true, for displaying other videos on end
	 * @param isDisplayPlayerControls : default argument set to true, for displaying player controls like play, pause, volume, seek bar
	 * @param isDisplayPlayerActions : default argument set to true, for displaying video title and share option on load
	 * @param isEnablePrivacyMode : default argument set to false, if set to true - YouTube doesn't store information of user until video played
	 * @param playerWidth : default argument set to 560, Width of player
	 * @param playerHeight : default argument set to 315, Height of player
	 * @return : HTML of embed youtube player
	 */
	getEmbedPlayer = function( url, isDisplaySuggestedVideo, isDisplayPlayerControls, isDisplayPlayerActions, isEnablePrivacyMode, playerWidth, playerHeight){
		var queryParams = [];
		var paramCount = 0;
		if (typeof(isDisplaySuggestedVideo)==='undefined') isDisplaySuggestedVideo = true;
  		if (typeof(isDisplayPlayerControls)==='undefined') isDisplayPlayerControls = true;
		if (typeof(isDisplayPlayerActions)==='undefined') isDisplayPlayerActions = true;
  		if (typeof(isEnablePrivacyMode)==='undefined') isEnablePrivacyMode = false;
		if (typeof(playerWidth)==='undefined') playerWidth = 560;
   		if (typeof(playerHeight)==='undefined') playerHeight = 315;
		if(!isDisplaySuggestedVideo)
			queryParams[paramCount++] = "rel=0";
		if(!isDisplayPlayerControls)
			queryParams[paramCount++] = "controls=0";
		if(!isDisplayPlayerActions)
			queryParams[paramCount++] = "showinfo=0";
		var embedUrl = (isEnablePrivacyMode ? youtube.yt_embed_url : youtube.yt_privacy_embed_url) + youtube.getIdByUrl(url) + "?" + queryParams.join("&amp;");
		return '<iframe width="' + playerWidth + '" height="' + playerHeight + '" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>';
	}
	
	/* Function for getting YouTube video id from URL
	 * @param url : URL of video
	 * @return : unique 11 character id of youtube video
	 */
	getIdByUrl = function(url){
		var parseUrl = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
		return parseUrl[1];
	}
	
	/* Function for initilize Google developer key
	 * @param url : Key
	 */
	init = function(key){
		localStorage.setItem("googDevkey", key);
		youtube.api_init = true;
	}
	
	/* Function for getting Google developer key from local storage
	 * @return : unique 11 character id of youtube video
	 */
	getGoogDevKey = function(){
		return localStorage.getItem("googDevkey");
	}
	
	/* Function for checking if google developer key is supplied to APi or not
	 * @return : boolean of key status
	 */
	checkInitStatus = function(){
		if(youtube.api_init){
			return true;
		}
		else{
			console.log("Google developer key must be provided to access API");
			console.log("call method init(YOUR_KEY)");
			return false;
		}
	}
	
	/* Function for getting YouTube video data
	 * @param url : URL of video
	 * @return : video data parts in JSON format
	 */
	getVideoData = function(url){
		if(youtube.checkInitStatus()){
			var id = youtube.getIdByUrl(url);
			var yt_api_url = "https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2C+contentDetails%2C+statistics%2C+status&id=" + id + "&key=" + youtube.getGoogDevKey();
			
		}
		return youtube.callGoogleAPI(yt_api_url);
	}
	
	/* Function for generating HTTP GET method to Google API server synchronously
	 * @param url : URL of unique Google API URL
	 * @return : video data parts in JSON format
	 */
	callGoogleAPI = function(api_url){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", api_url, false );
		xmlHttp.send( null );
		console.log(xmlHttp.responseText);
		return youtube.parseYouTubeVideoData(JSON.parse(xmlHttp.responseText));
	}
	
	/* Function for parsing data coming from Google to this API
	 * @param data : Google API data
	 * @return : parsed Data in JSON format
	 */
	parseYouTubeVideoData = function(data){
		var result = {};
		var details = data.items[0];
		result["id"] = details.id;
		var parsedDateTime = (details.snippet.publishedAt).split("T");
		result.publishDate = parsedDateTime[0];
		var formatTime = parsedDateTime[1].split(".");
		result.publishTime = formatTime[0];
		result.channelId = details.snippet.channelId;
		result.title = details.snippet.title;
		result.description = details.snippet.description;
		result.thumbnails = details.snippet.thumbnails;
		result.channelTitle = details.snippet.channelTitle;
		result.tags = details.snippet.tags;
		result.categoryId = details.snippet.categoryId;
		result.liveBroadcastContent = details.snippet.liveBroadcastContent;
		result.defaultAudioLanguage = details.snippet.defaultAudioLanguage;
		result.videoDuration = youtube.parseDuration(details.contentDetails.duration);
		result.dimension = details.dimension;
		result.defination = details.defination;
		result.licensedContent = details.licensedContent;
		result.uploadStatus = details.uploadStatus;
		result.privacyStatus = details.privacyStatus;
		result.license = details.license;
		result.embeddable = details.embeddable;
		result.publicStatusViewable = details.publicStatusViewable;
		result.viewCount = details.statistics.viewCount;
		result.likeCount = details.statistics.likeCount;
		result.dislikeCount = details.statistics.dislikeCount;
		result.favouriteCount = details.statistics.favouriteCount;
		result.commentCount = details.statistics.commentCount;
		return result;
	}
	
	/* Function for parsing Video duration 
	 * @param duration : YouTube time format
	 * @return : array of hours, minutes, seconds
	 */
	parseDuration = function(duration) {
		var time = [];
		var a = duration.match(/\d+/g);
		if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
			a = [0, a[0], 0];
		}
		if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
			a = [a[0], 0, a[1]];
		}
		if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
			a = [a[0], 0, 0];
		}
		if (a.length == 3) {
			time.hour = parseInt(a[0]);
			time.minute = parseInt(a[1]);
			time.second = parseInt(a[2]);
		}
		if (a.length == 2) {
			time.minute = parseInt(a[0]);
			time.second = parseInt(a[1]);
		}	
		if (a.length == 1) {
			time.second = parseInt(a[0]);
		}
		return time;
	}
	
	/*
	 * Assigning data mambers and member functions to object
	 */
	youtube.yt_domain_url = yt_domain_url;
	youtube.yt_channel_url = yt_channel_url;
	youtube.yt_video_url = yt_video_url;
	youtube.yt_embed_url = yt_embed_url;
	youtube.yt_privacy_embed_url = yt_privacy_embed_url;
	youtube.yt_api = yt_api;
	youtube.api_init = api_init;
	youtube.callGoogleAPI = callGoogleAPI;
	youtube.getEmbedVideoUrl = getEmbedVideoUrl;
	youtube.getEmbedPlayer = getEmbedPlayer;
	youtube.getIdByUrl = getIdByUrl;
	youtube.init = init;
	youtube.checkInitStatus = checkInitStatus;
	youtube.getGoogDevKey = getGoogDevKey;
	youtube.getVideoData = getVideoData;
	youtube.parseYouTubeVideoData = parseYouTubeVideoData;
	youtube.parseDuration = parseDuration;
}

/*
 * Calling API
 */
youtube();