$(document).ready(function(){
		//create a FormData object which will be sent via AJAX request
        var formData = new FormData();
		$('#upload-btn').on('click', function(){
			$('#upload-input').click();	
		});
		$('#upload-input').on('change', function(){
			var files = $(this).get(0).files;
			if(files.length>0){//one or more files selected
				var file = files[0];
				/*preview the image starts*/
          		var reader = new FileReader();
          		reader.onload = function(e){
          			$('#book-thumbnail-img').attr('src', e.target.result);
          		}
          		reader.readAsDataURL(file);
          		/*preview the image ends*/
	
          		//'upload[]' is the name attr of #upload-input
          		//append the selected file to formData obj
          		formData.append('upload[]', file, file.name);
        	}
		});

		$('#ensure-post-btn').on('click', function(){
			if(formData.get('upload[]')){
				$.ajax({
					url: '/upload',
					type: 'POST',
					data: formData,
					processData: false,
            		contentType: false,
					success: function(data){
						if(data==='success'){
							$('#post-book-help').text("Post success!");
							setTimeout(function(){$('#post-book-help').text('');}, 3000);
						}
					}
				});
			}
			else{//did not upload the book poster
				$('#thumbnail-help').text("Please upload a poster of the book!");
				setTimeout(function(){$('#thumbnail-help').text('');}, 3000);
			}
		});
	});