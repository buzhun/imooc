$(function(){
  $(".del").on('click',function(e){
    var id =  $(this).data('id')
    var tr = $(".item-id-"+id)

    $.ajax({
      type:'DELETE',
      url:'/admin/list?id='+id
    })
    .done(function(result){
      if(result.success ===1){
        if(tr.length >0){
          tr.remove();
        }
      }
    })
  })

    $("#douban").on('blur',function(e){
      var id = $(this).val()
      $.ajax({
        type:'POST',
        url:'https://api.douban.com/v2/movie/subject/'+id,
        dataType:'jsonp',
        jsonpCallback:'person',
        success:function (data) {
          $("#inputTitle").val(data.title)
          $("#inputDoctor").val(data.directors[0].name)
          $("#inputCountry").val(data.countries[0])
          $("#inputLanguage").val('英文')
          $("#inputYear").val(data.year)
          $("#inputFlash").val('')
          $("#inputPoster").val(data.images.medium)
          $("#inputSummary").val(data.summary)
        }
      })
    })
})
