var objectPoolFactory = function(createObjFn) {
	var objectPool = [];
	return {
		create: function() {
			var obj = objectPool.length === 0 ? createObjFn.apply(this, arguments) : objectPool.shift();
			return obj;
		},
		recover: function(obj) {
			objectPool.push(obj);
		}
	}
};
var iframeFactory = objectPoolFactory(function() {
	var iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	iframe.onload = function() {
		iframe.onload = null; // 防止iframe 重复加载的bug
		iframeFactory.recover(iframe); // iframe 加载完成之后回收节点
	}
	return iframe;
});
var iframe1 = iframeFactory.create();
iframe1.src = 'http://www.taobao.com';
var iframe2 = iframeFactory.create();
iframe2.src = 'http://jd.com';
setTimeout(function() {
	var iframe3 = iframeFactory.create();
	iframe3.src = 'http://163.com';
}, 3000);