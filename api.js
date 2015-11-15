function youtube(){
	var yt_domain_url = "https://www.youtube.com/";
	var yt_channel_url = yt_domain_url + "channel/";
	var yt_video_url = yt_domain_url + "watch?v=";
	var yt_embed_url = yt_domain_url + "embed/";
	var yt_privacy_embed_url = "https://www.youtube-nocookie.com/embed/";
	var yt_api = "";
	var api_init = false;
	getEmbedVideoUrl = function(url){
		return youtube.yt_embed_url + youtube.getIdByUrl(url);
	}
	getEmbedPlayer = function( url, isDisplaySuggestedVideo, isDisplayPlayerControls, isDisplayPlayerActions, isEnablePrivacyMode, playerWidth, playerHeight){
		var queryParams = [];
		var paramCount = 0;
		if (typeof(isDisplaySuggestedVideo)==='undefined') isDisplaySuggestedVideo = true;
  		if (typeof(isDisplayPlayerControls)==='undefined') isDisplayPlayerControls = true;
		if (typeof(isDisplayPlayerActions)==='undefined') isDisplayPlayerActions = true;
  		if (typeof(isEnablePrivacyMode)==='undefined') isEnablePrivacyMode = true;
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
		getIdByUrl = function(url){
			var parseUrl = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
			return parseUrl[1];
		}
		init = function(key){
			localStorage.setItem("googDevkey", key);
			youtube.api_init = true;
		}
		getGoogDevKey = function(){
			return localStorage.getItem("googDevkey");
		}
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
		getVideoData = function(url){
			var returnData = {};
			if(youtube.checkInitStatus()){
				var id = youtube.getIdByUrl(url);
				var yt_api_url = "https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2C+contentDetails%2C+statistics%2C+status&id=" + id + "&key=" + youtube.getGoogDevKey();
				console.log(yt_api_url);
				$.ajax({
					type: "GET",
					url: yt_api_url,
					cache: false,
					dataType:'jsonp',
					success: function(data){
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
						localStorage.setItem("videoData", JSON.stringify(result));
						console.log(JSON.stringify(result));
						returnData = JSON.parse(JSON.stringify(result));
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log("Error in retriving data from YouTube");
						
					}
				});
			}
			return JSON.parse(localStorage.getItem("videoData"));
		}
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
	youtube.yt_domain_url = yt_domain_url;
	youtube.yt_channel_url = yt_channel_url;
	youtube.yt_video_url = yt_video_url;
	youtube.yt_embed_url = yt_embed_url;
	youtube.yt_privacy_embed_url = yt_privacy_embed_url;
	youtube.yt_api = yt_api;
	youtube.api_init = api_init;
	youtube.getEmbedVideoUrl = getEmbedVideoUrl;
	youtube.getEmbedPlayer = getEmbedPlayer;
	youtube.getIdByUrl = getIdByUrl;
	youtube.init = init;
	youtube.checkInitStatus = checkInitStatus;
	youtube.getGoogDevKey = getGoogDevKey;
	youtube.getVideoData = getVideoData;
	youtube.parseDuration = parseDuration;
}
youtube();