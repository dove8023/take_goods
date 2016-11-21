/*
 * test node api.
 * time @ 2016.5.23
*/

var result;
console.log(document.cookie);

var formE = $("#formData");
formE.find('input[type="submit"]').on("click" , function(event){

	event.preventDefault();
	$.ajax({
		"url":"/user/api/login",
		"type":"post",
		"dataType":"json",
		"data":{
			"phone":formE.find('input[type="number"]').eq(0).val(),
			"password":formE.find('input[type="password"]').eq(0).val()
		},
		success:function(data){
			console.log(data);
			result = data;



			if(document.cookie.indexOf("session_id") > -1){
				$("#loginSection").hide();
				$("#manageSection").show();
			}
		},
		error:function(err){
			console.log(err);
		}
	});
})




if(document.cookie.indexOf("session_id") > -1){
	$("#loginSection").hide();
	$("#manageSection").show();
}


