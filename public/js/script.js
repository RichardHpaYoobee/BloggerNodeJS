var APIKey;
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
	if(title.length == 0){
		alert("please enter a title");
		return;
	} 
	if(content.length == 0){
		alert("please enter some content");
		return;
	} 
	$.ajax({
		url: url,
		type: "post",
		data: { title: title, content : content},
		dataType:"json",
        success: function(result) {
   			console.log(result);
        	window.location = result;
        },
        error:function(error){
        	console.log(error);
        }
	})
});


