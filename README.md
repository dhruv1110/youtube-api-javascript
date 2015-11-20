# youtube-api-javascript
This API used for fetching data from YouTube like Video details, channel details, list of popular videos. This also helps in getting embed player HTML with various configuration.

##How to use
1. Get the Google Developer Key from Google Developer Console. Follow this link. https://developers.google.com/youtube/registering_an_application
2. Include the JS file in your head section
3. Initilize API with Google developer key by writing this line
```javascript
youtube.init(YOUR_KEY);
```

###Getting Video Data
```javascript
var data = youtube.getVideoData(YOUTUBE_VIDEO_URL);
```
This method returns JSON array of video data. This are the elements which are retrieved
```javscript
data.id
data.publishedAt
data.channelId
data.title
data.description
data.thumbnails.default.url
data.thumbnails.default.width
data.thumbnails.default.height
data.channelTitle
data.tags[]
data.categoryId
data.liveBroadcastContent
data.defaultAudioLanguage
data.videoDuration
data.dimension
data.defination
data.licensedContent
data.uploadStatus
data.privacyStatus
data.license
data.embeddable
data.publicStatusViewable
data.viewCount
data.likeCount
data.dislikeCount
data.favouriteCount
data.commentCount
```

### Embed Player HTML
```javascript
youtube.getEmbedPlayer(YOUTUBE_VIDEO_URL, [isDisplaySuggestedVideo = true, isDisplayPlayerControls = true, isDisplayPlayerActions = true, isEnablePrivacyMode = false, playerWidth = 630, playerHeight = 315]):
```
Here's only first argument is mandatory, others is optional
```
isDisplaySuggestedVideo : default argument set to true, for displaying other videos on end
isDisplayPlayerControls : default argument set to true, for displaying player controls like play, pause, volume, seek bar
isDisplayPlayerActions : default argument set to true, for displaying video title and share option on load
isEnablePrivacyMode : default argument set to false, if set to true - YouTube doesn't store information of user until video played
playerWidth : default argument set to 560, Width of player
playerHeight : default argument set to 315, Height of player
```

### Embed Player URL
```javascript
youtube.getEmbedVideoUrl(YOUTUBE_VIDEO_URL);
```

Visit other projects at http://dhruvpatel.net
