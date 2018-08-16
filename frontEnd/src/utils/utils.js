/*convert a string composed of comma separated values to an array of objects */
function get_tags(tags, tag_name){
    const t=tags.split(',')
    let new_tags = []
    t.forEach(function( value ){
        if(value.trim().length > 0){
            const obj = {}
            obj[tag_name] = value.trim()
            new_tags.push( obj )
        }
    });
    return new_tags
}

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        //bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) //&&
        //bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function scrollToTop(scrollDuration) {
  const scrollHeight = window.scrollY,
        scrollStep = Math.PI / ( scrollDuration / 15 ),
        cosParameter = scrollHeight / 2;
  var   scrollCount = 0,
        scrollMargin,
        scrollInterval = setInterval( function() {
              if ( window.scrollY !== 0 ) {
                  scrollCount = scrollCount + 1;
                  scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
                  window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
              }
              else clearInterval(scrollInterval);
          }, 15 );
}

export {isInViewport, get_tags, scrollToTop}
