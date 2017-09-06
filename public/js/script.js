var APIKey;
//Get Config Data
$.ajax({
	url: "config/config.json",
	dataType:"json",
	success:function(data){
		APIKey = data.APIKey
		getPosts();
	}
});

function getPosts(){
	$.ajax({
		url: "https://www.googleapis.com/blogger/v3/blogs/1251278663663343818/posts?key="+APIKey,
		type: "GET",
		dataType:"jsonp",
		beforeSend: function(x) {
			if (x && x.overrideMimeType) {
			  x.overrideMimeType("application/j-son;charset=UTF-8");
			}
		},
	    success: function(result) {
	    	var posts = result.items;
	    	for (var i = 0; i < posts.length; i++) {
	    		$("#Posts").append("<div><h3>"+posts[i].title+"</h3><p>"+posts[i].content+"</p></div><hr>");
	    	};
	    }
	})
}

$("#postForm").submit(function(event){

	event.preventDefault();
	console.log("form sent");
	var title = $("#title").val();
	var content = $("#content").val();
	var url = "http://localhost:3000/createGoogleBloggerPost";
	var SendData = "";
	if(title.length == 0){
		alert("please enter a title");
		return;
	} else {
		url += "/title="+title
	}
	if(content.length == 0){
		alert("please enter some content");
		return;
	} else {
		url += "/content="+content
	}
	$.ajax({
		url: url,
		type: "get",
		dataType:"json",
        success: function(result) {
        	// console.log(result + "&title=dsfasfdsgadgfdsf");
        	var params = {"title":title, "content":content};
        	console.log(JSON.stringify(params));
        	window.location = result + "&state="+JSON.stringify(params);
 	    	$("#result").text("Post was successfully sent");
        },
        error:function(error){
        	console.log(error);
        }

	})




});


