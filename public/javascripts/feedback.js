var toggleRating = function (thisNode, ratingType, feedbackId) {
	if(!thisNode.prop('checked')){
		if (ratingType === 'pertinent'){
			$.ajax({url:'feedback/'+feedbackId+'/pertinent/0',type:'POST'});
		} else {
			$.ajax({url:'feedback/'+feedbackId+'/inspiring/0',type:'POST'});
		}
	} else {
		if (ratingType === 'pertinent'){
			$.ajax({url:'feedback/'+feedbackId+'/pertinent/1',type:'POST'});
		} else {
			$.ajax({url:'feedback/'+feedbackId+'/inspiring/1',type:'POST'});
		}
	}
}
