!function(e,g){L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,clusterPane:L.Marker.prototype.options.pane,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animate:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,spiderLegPolylineOptions:{weight:1.5,color:"#222",opacity:.5},chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(e){L.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.addEventParent(this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.addEventParent(this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[],this._childMarkerEventHandlers={dragstart:this._childMarkerDragStart,move:this._childMarkerMoved,dragend:this._childMarkerDragEnd};var t=L.DomUtil.TRANSITION&&this.options.animate;L.extend(this,t?this._withAnimation:this._noAnimation),this._markerCluster=t?L.MarkerCluster:L.MarkerClusterNonAnimated},addLayer:function(e){if(e instanceof L.LayerGroup)return this.addLayers([e]);if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this.fire("layeradd",{layer:e}),this;if(!this._map)return this._needsClustering.push(e),this.fire("layeradd",{layer:e}),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom),this.fire("layeradd",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons();var t=e,i=this._zoom;if(e.__parent)for(;t.__parent._zoom>=i;)t=t.__parent;return this._currentShownBounds.contains(t.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,t):this._animationAddLayerNonAnimated(e,t)),this},removeLayer:function(e){return e instanceof L.LayerGroup?this.removeLayers([e]):(e.getLatLng?this._map?e.__parent&&(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this.fire("layerremove",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),e.off(this._childMarkerEventHandlers,this),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow())):(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push({layer:e,latlng:e._latlng}),this.fire("layerremove",{layer:e})):(this._nonPointGroup.removeLayer(e),this.fire("layerremove",{layer:e})),this)},addLayers:function(n,s){if(!L.Util.isArray(n))return this.addLayer(n);var o,a=this._featureGroup,h=this._nonPointGroup,l=this.options.chunkedLoading,u=this.options.chunkInterval,_=this.options.chunkProgress,d=n.length,c=0,p=!0;if(this._map){var m=(new Date).getTime(),f=L.bind(function(){for(var e,t,i=(new Date).getTime();c<d;c++){if(l&&c%200==0){var r=(new Date).getTime()-i;if(u<r)break}(o=n[c])instanceof L.LayerGroup?(p&&(n=n.slice(),p=!1),this._extractNonGroupLayers(o,n),d=n.length):o.getLatLng?this.hasLayer(o)||(this._addLayer(o,this._maxZoom),s||this.fire("layeradd",{layer:o}),o.__parent&&2===o.__parent.getChildCount()&&(t=(e=o.__parent.getAllChildMarkers())[0]===o?e[1]:e[0],a.removeLayer(t))):(h.addLayer(o),s||this.fire("layeradd",{layer:o}))}_&&_(c,d,(new Date).getTime()-m),c===d?(this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(f,this.options.chunkDelay)},this);f()}else for(var e=this._needsClustering;c<d;c++)(o=n[c])instanceof L.LayerGroup?(p&&(n=n.slice(),p=!1),this._extractNonGroupLayers(o,n),d=n.length):o.getLatLng?this.hasLayer(o)||e.push(o):h.addLayer(o);return this},removeLayers:function(e){var t,i=e.length,r=this._featureGroup,n=this._nonPointGroup,s=!0;if(!this._map){for(h=0;h<i;h++)(t=e[h])instanceof L.LayerGroup?(s&&(e=e.slice(),s=!1),this._extractNonGroupLayers(t,e),i=e.length):(this._arraySplice(this._needsClustering,t),n.removeLayer(t),this.hasLayer(t)&&this._needsRemoving.push({layer:t,latlng:t._latlng}),this.fire("layerremove",{layer:t}));return this}if(this._unspiderfy){this._unspiderfy();for(var o=e.slice(),a=i,h=0;h<a;h++)(t=o[h])instanceof L.LayerGroup?(this._extractNonGroupLayers(t,o),a=o.length):this._unspiderfyLayer(t)}for(h=0;h<i;h++)(t=e[h])instanceof L.LayerGroup?(s&&(e=e.slice(),s=!1),this._extractNonGroupLayers(t,e),i=e.length):t.__parent?(this._removeLayer(t,!0,!0),this.fire("layerremove",{layer:t}),r.hasLayer(t)&&(r.removeLayer(t),t.clusterShow&&t.clusterShow())):(n.removeLayer(t),this.fire("layerremove",{layer:t}));return this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),this},clearLayers:function(){return this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(e){e.off(this._childMarkerEventHandlers,this),delete e.__parent},this),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new L.LatLngBounds;this._topClusterLevel&&e.extend(this._topClusterLevel._bounds);for(var t=this._needsClustering.length-1;0<=t;t--)e.extend(this._needsClustering[t].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(e,t){var i,r,n,s=this._needsClustering.slice(),o=this._needsRemoving;for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(s),r=s.length-1;0<=r;r--){for(i=!0,n=o.length-1;0<=n;n--)if(o[n].layer===s[r]){i=!1;break}i&&e.call(t,s[r])}this._nonPointGroup.eachLayer(e,t)},getLayers:function(){var t=[];return this.eachLayer(function(e){t.push(e)}),t},getLayer:function(t){var i=null;return t=parseInt(t,10),this.eachLayer(function(e){L.stamp(e)===t&&(i=e)}),i},hasLayer:function(e){if(!e)return!1;for(var t=this._needsClustering,i=t.length-1;0<=i;i--)if(t[i]===e)return!0;for(i=(t=this._needsRemoving).length-1;0<=i;i--)if(t[i].layer===e)return!1;return!(!e.__parent||e.__parent._group!==this)||this._nonPointGroup.hasLayer(e)},zoomToShowLayer:function(e,t){"function"!=typeof t&&(t=function(){});var i=function(){!e._icon&&!e.__parent._icon||this._inZoomAnimation||(this._map.off("moveend",i,this),this.off("animationend",i,this),e._icon?t():e.__parent._icon&&(this.once("spiderfied",t,this),e.__parent.spiderfy()))};e._icon&&this._map.getBounds().contains(e.getLatLng())?t():e.__parent._zoom<Math.round(this._map._zoom)?(this._map.on("moveend",i,this),this._map.panTo(e.getLatLng())):(this._map.on("moveend",i,this),this.on("animationend",i,this),e.__parent.zoomToBounds())},onAdd:function(e){var t,i,r;if(this._map=e,!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.addTo(e),this._nonPointGroup.addTo(e),this._gridClusters||this._generateInitialClusters(),this._maxLat=e.options.crs.projection.MAX_LATITUDE,t=0,i=this._needsRemoving.length;t<i;t++)(r=this._needsRemoving[t]).newlatlng=r.layer._latlng,r.layer._latlng=r.latlng;for(t=0,i=this._needsRemoving.length;t<i;t++)r=this._needsRemoving[t],this._removeLayer(r.layer,!0),r.layer._latlng=r.newlatlng;this._needsRemoving=[],this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i,!0)},onRemove:function(e){e.off("zoomend",this._zoomEnd,this),e.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),delete this._maxLat,this._hideCoverage(),this._featureGroup.remove(),this._nonPointGroup.remove(),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(e){for(var t=e;t&&!t._icon;)t=t.__parent;return t||null},_arraySplice:function(e,t){for(var i=e.length-1;0<=i;i--)if(e[i]===t)return e.splice(i,1),!0},_removeFromGridUnclustered:function(e,t){for(var i=this._map,r=this._gridUnclustered,n=Math.floor(this._map.getMinZoom());n<=t&&r[t].removeObject(e,i.project(e.getLatLng(),t));t--);},_childMarkerDragStart:function(e){e.target.__dragStart=e.target._latlng},_childMarkerMoved:function(e){var t;this._ignoreMove||e.target.__dragStart||(t=e.target._popup&&e.target._popup.isOpen(),this._moveChild(e.target,e.oldLatLng,e.latlng),t&&e.target.openPopup())},_moveChild:function(e,t,i){e._latlng=t,this.removeLayer(e),e._latlng=i,this.addLayer(e)},_childMarkerDragEnd:function(e){e.target.__dragStart&&this._moveChild(e.target,e.target.__dragStart,e.target._latlng),delete e.target.__dragStart},_removeLayer:function(e,t,i){var r=this._gridClusters,n=this._gridUnclustered,s=this._featureGroup,o=this._map,a=Math.floor(this._map.getMinZoom());t&&this._removeFromGridUnclustered(e,this._maxZoom);var h,l=e.__parent,u=l._markers;for(this._arraySplice(u,e);l&&(l._childCount--,l._boundsNeedUpdate=!0,!(l._zoom<a));)t&&l._childCount<=1?(h=l._markers[0]===e?l._markers[1]:l._markers[0],r[l._zoom].removeObject(l,o.project(l._cLatLng,l._zoom)),n[l._zoom].addObject(h,o.project(h.getLatLng(),l._zoom)),this._arraySplice(l.__parent._childClusters,l),l.__parent._markers.push(h),h.__parent=l.__parent,l._icon&&(s.removeLayer(l),i||s.addLayer(h))):l._iconNeedsUpdate=!0,l=l.__parent;delete e.__parent},_isOrIsParent:function(e,t){for(;t;){if(e===t)return!0;t=t.parentNode}return!1},fire:function(e,t,i){if(t&&t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;e="cluster"+e}L.FeatureGroup.prototype.fire.call(this,e,t,i)},listens:function(e,t){return L.FeatureGroup.prototype.listens.call(this,e,t)||L.FeatureGroup.prototype.listens.call(this,"cluster"+e,t)},_defaultIconCreateFunction:function(e){var t,r=e.getAllChildMarkers();if("default"==(t=void 0!==r[0].options.mode?r[0].options.mode:"default")){var n=e.getChildCount(),s=" marker-cluster-";return s+=n<10?"small":n<100?"medium":"large",new L.DivIcon({html:"<div><span>"+n+"</span></div>",className:"marker-cluster"+s,iconSize:new L.Point(32,32)})}if("twd"==t){var o=0,a=0,h=0;for(i=0;i<r.length;i++)-1e3!=Number(r[i].options.centre_status)?(a+=Number(r[i].options.centre_status),h+=Number(r[i].options.outline_status)):o+=1;var l=Number.parseFloat(a/(r.length-o)).toPrecision(3),s=" ";return.667<=Number.parseFloat(h/(r.length-o)).toPrecision(3)&&(s+="marker-outline-frost "),isNaN(l)?(s+="marker-twd-na",l="NA"):2.333<=l?s+="marker-twd-c1":1.667<=l&l<2.333?s+="marker-twd-c2":0<l&l<1.667?s+="marker-twd-c3":0==l&&(s+="marker-twd-c4"),new L.DivIcon({html:"<div><span></span></div>",className:"marker-cluster"+s,iconSize:new L.Point(32,32)})}if("gro"==t){o=0,a=0,h=0;for(i=0;i<r.length;i++)-1e3!=Number(r[i].options.centre_status)?(a+=Number(r[i].options.centre_status),h+=Number(r[i].options.outline_status)):o+=1;l=Number.parseFloat(a/(r.length-o)).toPrecision(3),s=" ";return.667<=Number.parseFloat(h/(r.length-o)).toPrecision(3)&&(s+="marker-outline-sleep "),isNaN(l)?(s+="marker-gro-na",l="NA"):2.333<=l?s+="marker-gro-c1":1.667<=l&l<2.333?s+="marker-gro-c2":0<l&l<1.667?s+="marker-gro-c3":0==l&&(s+="marker-gro-c4"),new L.DivIcon({html:"<div><span></span></div>",className:"marker-cluster"+s,iconSize:new L.Point(32,32)})}if("ssi"==t){o=0,a=0;for(i=0;i<r.length;i++)-1e3!=Number(r[i].options.centre_status)?a+=Number(r[i].options.centre_status):o+=1;l=Number.parseFloat(a/(r.length-o)).toPrecision(3),s=" marker-";return isNaN(l)?(s+="ssi-na",l="NA"):67<=l?s+="ssi-c1":33<=l&l<67?s+="ssi-c2":0<l&l<33?s+="ssi-c3":0==l&&(s+="ssi-c4"),new L.DivIcon({html:"<div><span></span></div>",className:"marker-cluster"+s,iconSize:new L.Point(32,32)})}if("lwf"==t){l=r.length,s=" marker-";return s+="lwf-na",l="NA",new L.DivIcon({html:"<div><span></span></div>",className:"marker-cluster"+s,iconSize:new L.Point(32,32)})}},_bindEvents:function(){var e=this._map,t=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,r=this.options.zoomToBoundsOnClick;(t||r)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),e.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(e){for(var t=e.layer,i=t;1===i._childClusters.length;)i=i._childClusters[0];i._zoom===this._maxZoom&&i._childCount===t._childCount&&this.options.spiderfyOnMaxZoom?t.spiderfy():this.options.zoomToBoundsOnClick&&t.zoomToBounds(),e.originalEvent&&13===e.originalEvent.keyCode&&this._map._container.focus()},_showCoverage:function(e){var t=this._map;this._inZoomAnimation||(this._shownPolygon&&t.removeLayer(this._shownPolygon),2<e.layer.getChildCount()&&e.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),t.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var e=this.options.spiderfyOnMaxZoom,t=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,r=this._map;(e||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),t&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),r.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){var e;this._inZoomAnimation||(e=this._getExpandedVisibleBounds(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,Math.round(this._map._zoom),e),this._currentShownBounds=e)},_generateInitialClusters:function(){var e=Math.ceil(this._map.getMaxZoom()),t=Math.floor(this._map.getMinZoom()),i=this.options.maxClusterRadius,r="function"!=typeof i?function(){return i}:i;null!==this.options.disableClusteringAtZoom&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var n=e;t<=n;n--)this._gridClusters[n]=new L.DistanceGrid(r(n)),this._gridUnclustered[n]=new L.DistanceGrid(r(n));this._topClusterLevel=new this._markerCluster(this,t-1)},_addLayer:function(e,t){var i,r=this._gridClusters,n=this._gridUnclustered,s=Math.floor(this._map.getMinZoom());for(this.options.singleMarkerMode&&this._overrideMarkerIcon(e),e.on(this._childMarkerEventHandlers,this);s<=t;t--){i=this._map.project(e.getLatLng(),t);var o=r[t].getNearObject(i);if(o)return o._addChild(e),void(e.__parent=o);if(o=n[t].getNearObject(i)){var a=o.__parent;a&&this._removeLayer(o,!1);var h=new this._markerCluster(this,t,o,e);r[t].addObject(h,this._map.project(h._cLatLng,t)),o.__parent=h;for(var l=e.__parent=h,u=t-1;u>a._zoom;u--)l=new this._markerCluster(this,u,l),r[u].addObject(l,this._map.project(o.getLatLng(),u));return a._addChild(l),void this._removeFromGridUnclustered(o,t)}n[t].addObject(e,i)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_refreshClustersIcons:function(){this._featureGroup.eachLayer(function(e){e instanceof L.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()})},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var e=0;e<this._queue.length;e++)this._queue[e].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){var e=Math.round(this._map._zoom);this._processQueue(),this._zoom<e&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,e)):this._zoom>e?(this._animationStart(),this._animationZoomOut(this._zoom,e)):this._moveEnd()},_getExpandedVisibleBounds:function(){return this.options.removeOutsideVisibleBounds?L.Browser.mobile?this._checkBoundsMaxLat(this._map.getBounds()):this._checkBoundsMaxLat(this._map.getBounds().pad(1)):this._mapBoundsInfinite},_checkBoundsMaxLat:function(e){var t=this._maxLat;return t!==g&&(e.getNorth()>=t&&(e._northEast.lat=1/0),e.getSouth()<=-t&&(e._southWest.lat=-1/0)),e},_animationAddLayerNonAnimated:function(e,t){var i;t===e?this._featureGroup.addLayer(e):2===t._childCount?(t._addToMap(),i=t.getAllChildMarkers(),this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])):t._updateIcon()},_extractNonGroupLayers:function(e,t){var i,r=e.getLayers(),n=0;for(t=t||[];n<r.length;n++)(i=r[n])instanceof L.LayerGroup?this._extractNonGroupLayers(i,t):t.push(i);return t},_overrideMarkerIcon:function(e){return e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}})}}),L.MarkerClusterGroup.include({_mapBoundsInfinite:new L.LatLngBounds(new L.LatLng(-1/0,-1/0),new L.LatLng(1/0,1/0))}),L.MarkerClusterGroup.include({_noAnimation:{_animationStart:function(){},_animationZoomIn:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(e,t){this._animationAddLayerNonAnimated(e,t)}},_withAnimation:{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationZoomIn:function(n,s){var o,a=this._getExpandedVisibleBounds(),h=this._featureGroup,e=Math.floor(this._map.getMinZoom());this._ignoreMove=!0,this._topClusterLevel._recursively(a,n,e,function(e){var t,i=e._latlng,r=e._markers;for(a.contains(i)||(i=null),e._isSingleParent()&&n+1===s?(h.removeLayer(e),e._recursivelyAddChildrenToMap(null,s,a)):(e.clusterHide(),e._recursivelyAddChildrenToMap(i,s,a)),o=r.length-1;0<=o;o--)t=r[o],a.contains(t._latlng)||h.removeLayer(t)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(a,s),h.eachLayer(function(e){e instanceof L.MarkerCluster||!e._icon||e.clusterShow()}),this._topClusterLevel._recursively(a,n,s,function(e){e._recursivelyRestoreChildPositions(s)}),this._ignoreMove=!1,this._enqueue(function(){this._topClusterLevel._recursively(a,n,e,function(e){h.removeLayer(e),e.clusterShow()}),this._animationEnd()})},_animationZoomOut:function(e,t){this._animationZoomOutSingle(this._topClusterLevel,e-1,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e,this._getExpandedVisibleBounds())},_animationAddLayer:function(e,t){var i=this,r=this._featureGroup;r.addLayer(e),t!==e&&(2<t._childCount?(t._updateIcon(),this._forceLayout(),this._animationStart(),e._setPos(this._map.latLngToLayerPoint(t.getLatLng())),e.clusterHide(),this._enqueue(function(){r.removeLayer(e),e.clusterShow(),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(t,this._map.getMaxZoom(),this._zoom)))}},_animationZoomOutSingle:function(t,i,r){var n=this._getExpandedVisibleBounds(),s=Math.floor(this._map.getMinZoom());t._recursivelyAnimateChildrenInAndAddSelfToMap(n,s,i+1,r);var o=this;this._forceLayout(),t._recursivelyBecomeVisible(n,r),this._enqueue(function(){var e;1===t._childCount?(e=t._markers[0],this._ignoreMove=!0,e.setLatLng(e.getLatLng()),this._ignoreMove=!1,e.clusterShow&&e.clusterShow()):t._recursively(n,r,s,function(e){e._recursivelyRemoveChildrenFromMap(n,s,i+1)}),o._animationEnd()})},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_forceLayout:function(){L.Util.falseFn(e.body.offsetWidth)}}),L.markerClusterGroup=function(e){return new L.MarkerClusterGroup(e)},L.MarkerCluster=L.Marker.extend({initialize:function(e,t,i,r){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this,pane:e.options.clusterPane}),this._group=e,this._zoom=t,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),r&&this._addChild(r)},getAllChildMarkers:function(e){e=e||[];for(var t=this._childClusters.length-1;0<=t;t--)this._childClusters[t].getAllChildMarkers(e);for(var i=this._markers.length-1;0<=i;i--)e.push(this._markers[i]);return e},getChildCount:function(){return this._childCount},zoomToBounds:function(e){for(var t=this._childClusters.slice(),i=this._group._map,r=i.getBoundsZoom(this._bounds),n=this._zoom+1,s=i.getZoom();0<t.length&&n<r;){n++;for(var o=[],a=0;a<t.length;a++)o=o.concat(t[a]._childClusters);t=o}n<r?this._group._map.setView(this._latlng,n):r<=s?this._group._map.setView(this._latlng,s+1):this._group._map.fitBounds(this._bounds,e)},getBounds:function(){var e=new L.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,t){this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._setClusterCenter(e),e instanceof L.MarkerCluster?(t||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(t||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_setClusterCenter:function(e){this._cLatLng||(this._cLatLng=e._cLatLng||e._latlng)},_resetBounds:function(){var e=this._bounds;e._southWest&&(e._southWest.lat=1/0,e._southWest.lng=1/0),e._northEast&&(e._northEast.lat=-1/0,e._northEast.lng=-1/0)},_recalculateBounds:function(){var e,t,i,r,n=this._markers,s=this._childClusters,o=0,a=0,h=this._childCount;if(0!==h){for(this._resetBounds(),e=0;e<n.length;e++)i=n[e]._latlng,this._bounds.extend(i),o+=i.lat,a+=i.lng;for(e=0;e<s.length;e++)(t=s[e])._boundsNeedUpdate&&t._recalculateBounds(),this._bounds.extend(t._bounds),i=t._wLatLng,r=t._childCount,o+=i.lat*r,a+=i.lng*r;this._latlng=this._wLatLng=new L.LatLng(o/h,a/h),this._boundsNeedUpdate=!1}},_addToMap:function(e){e&&(this._backupLatlng=this._latlng,this.setLatLng(e)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(e,n,t){this._recursively(e,this._group._map.getMinZoom(),t-1,function(e){for(var t,i=e._markers,r=i.length-1;0<=r;r--)(t=i[r])._icon&&(t._setPos(n),t.clusterHide())},function(e){for(var t,i=e._childClusters,r=i.length-1;0<=r;r--)(t=i[r])._icon&&(t._setPos(n),t.clusterHide())})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(t,i,r,n){this._recursively(t,n,i,function(e){e._recursivelyAnimateChildrenIn(t,e._group._map.latLngToLayerPoint(e.getLatLng()).round(),r),e._isSingleParent()&&r-1===n?(e.clusterShow(),e._recursivelyRemoveChildrenFromMap(t,i,r)):e.clusterHide(),e._addToMap()})},_recursivelyBecomeVisible:function(e,t){this._recursively(e,this._group._map.getMinZoom(),t,null,function(e){e.clusterShow()})},_recursivelyAddChildrenToMap:function(r,n,s){this._recursively(s,this._group._map.getMinZoom()-1,n,function(e){if(n!==e._zoom)for(var t=e._markers.length-1;0<=t;t--){var i=e._markers[t];s.contains(i._latlng)&&(r&&(i._backupLatlng=i.getLatLng(),i.setLatLng(r),i.clusterHide&&i.clusterHide()),e._group._featureGroup.addLayer(i))}},function(e){e._addToMap(r)})},_recursivelyRestoreChildPositions:function(e){for(var t=this._markers.length-1;0<=t;t--){var i=this._markers[t];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(e-1===this._zoom)for(var r=this._childClusters.length-1;0<=r;r--)this._childClusters[r]._restorePosition();else for(var n=this._childClusters.length-1;0<=n;n--)this._childClusters[n]._recursivelyRestoreChildPositions(e)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(e,t,i,r){var n,s;this._recursively(e,t-1,i-1,function(e){for(s=e._markers.length-1;0<=s;s--)n=e._markers[s],r&&r.contains(n._latlng)||(e._group._featureGroup.removeLayer(n),n.clusterShow&&n.clusterShow())},function(e){for(s=e._childClusters.length-1;0<=s;s--)n=e._childClusters[s],r&&r.contains(n._latlng)||(e._group._featureGroup.removeLayer(n),n.clusterShow&&n.clusterShow())})},_recursively:function(e,t,i,r,n){var s,o,a=this._childClusters,h=this._zoom;if(t<=h&&(r&&r(this),n&&h===i&&n(this)),h<t||h<i)for(s=a.length-1;0<=s;s--)o=a[s],e.intersects(o._bounds)&&o._recursively(e,t,i,r,n)},_isSingleParent:function(){return 0<this._childClusters.length&&this._childClusters[0]._childCount===this._childCount}}),L.Marker.include({clusterHide:function(){return this.options.opacityWhenUnclustered=this.options.opacity||1,this.setOpacity(0)},clusterShow:function(){var e=this.setOpacity(this.options.opacity||this.options.opacityWhenUnclustered);return delete this.options.opacityWhenUnclustered,e}}),L.DistanceGrid=function(e){this._cellSize=e,this._sqCellSize=e*e,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(e,t){var i=this._getCoord(t.x),r=this._getCoord(t.y),n=this._grid,s=n[r]=n[r]||{},o=s[i]=s[i]||[],a=L.Util.stamp(e);this._objectPoint[a]=t,o.push(e)},updateObject:function(e,t){this.removeObject(e),this.addObject(e,t)},removeObject:function(e,t){var i,r,n=this._getCoord(t.x),s=this._getCoord(t.y),o=this._grid,a=o[s]=o[s]||{},h=a[n]=a[n]||[];for(delete this._objectPoint[L.Util.stamp(e)],i=0,r=h.length;i<r;i++)if(h[i]===e)return h.splice(i,1),1===r&&delete a[n],!0},eachObject:function(e,t){var i,r,n,s,o,a,h=this._grid;for(i in h)for(r in o=h[i])for(n=0,s=(a=o[r]).length;n<s;n++)e.call(t,a[n])&&(n--,s--)},getNearObject:function(e){for(var t,i,r,n,s,o,a,h=this._getCoord(e.x),l=this._getCoord(e.y),u=this._objectPoint,_=this._sqCellSize,d=null,c=l-1;c<=l+1;c++)if(r=this._grid[c])for(t=h-1;t<=h+1;t++)if(n=r[t])for(i=0,s=n.length;i<s;i++)o=n[i],((a=this._sqDist(u[L.Util.stamp(o)],e))<_||a<=_&&null===d)&&(_=a,d=o);return d},_getCoord:function(e){var t=Math.floor(e/this._cellSize);return isFinite(t)?t:e},_sqDist:function(e,t){var i=t.x-e.x,r=t.y-e.y;return i*i+r*r}},L.QuickHull={getDistant:function(e,t){var i=t[1].lat-t[0].lat;return(t[0].lng-t[1].lng)*(e.lat-t[0].lat)+i*(e.lng-t[0].lng)},findMostDistantPointFromBaseLine:function(e,t){for(var i,r,n=0,s=null,o=[],a=t.length-1;0<=a;a--)i=t[a],0<(r=this.getDistant(i,e))&&(o.push(i),n<r&&(n=r,s=i));return{maxPoint:s,newPoints:o}},buildConvexHull:function(e,t){var i=[],r=this.findMostDistantPointFromBaseLine(e,t);return r.maxPoint?i=(i=i.concat(this.buildConvexHull([e[0],r.maxPoint],r.newPoints))).concat(this.buildConvexHull([r.maxPoint,e[1]],r.newPoints)):[e[0]]},getConvexHull:function(e){for(var t=!1,i=!1,r=!1,n=!1,s=null,o=null,a=null,h=null,l=null,u=null,_=e.length-1;0<=_;_--){var d=e[_];(!1===t||d.lat>t)&&(t=(s=d).lat),(!1===i||d.lat<i)&&(i=(o=d).lat),(!1===r||d.lng>r)&&(r=(a=d).lng),(!1===n||d.lng<n)&&(n=(h=d).lng)}return l=i!==t?(u=o,s):(u=h,a),[].concat(this.buildConvexHull([u,l],e),this.buildConvexHull([l,u],e))}},L.MarkerCluster.include({getConvexHull:function(){for(var e,t=this.getAllChildMarkers(),i=[],r=t.length-1;0<=r;r--)e=t[r].getLatLng(),i.push(e);return L.QuickHull.getConvexHull(i)}}),L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){var e,t,i;this._group._spiderfied===this||this._group._inZoomAnimation||(e=this.getAllChildMarkers(),t=this._group._map.latLngToLayerPoint(this._latlng),this._group._unspiderfy(),this._group._spiderfied=this,i=e.length>=this._circleSpiralSwitchover?this._generatePointsSpiral(e.length,t):(t.y+=10,this._generatePointsCircle(e.length,t)),this._animationSpiderfy(e,i))},unspiderfy:function(e){this._group._inZoomAnimation||(this._animationUnspiderfy(e),this._group._spiderfied=null)},_generatePointsCircle:function(e,t){for(var i,r=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e)/this._2PI,n=this._2PI/e,s=[],o=(s.length=e)-1;0<=o;o--)i=this._circleStartAngle+o*n,s[o]=new L.Point(t.x+r*Math.cos(i),t.y+r*Math.sin(i))._round();return s},_generatePointsSpiral:function(e,t){for(var i=this._group.options.spiderfyDistanceMultiplier,r=i*this._spiralLengthStart,n=i*this._spiralFootSeparation,s=i*this._spiralLengthFactor*this._2PI,o=0,a=[],h=(a.length=e)-1;0<=h;h--)o+=n/r+5e-4*h,a[h]=new L.Point(t.x+r*Math.cos(o),t.y+r*Math.sin(o))._round(),r+=s/o;return a},_noanimationUnspiderfy:function(){var e,t,i=this._group,r=i._map,n=i._featureGroup,s=this.getAllChildMarkers();for(i._ignoreMove=!0,this.setOpacity(1),t=s.length-1;0<=t;t--)e=s[t],n.removeLayer(e),e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng),e.setZIndexOffset&&e.setZIndexOffset(0),e._spiderLeg&&(r.removeLayer(e._spiderLeg),delete e._spiderLeg);i.fire("unspiderfied",{cluster:this,markers:s}),i._ignoreMove=!1,i._spiderfied=null}}),L.MarkerClusterNonAnimated=L.MarkerCluster.extend({_animationSpiderfy:function(e,t){var i,r,n,s,o=this._group,a=o._map,h=o._featureGroup,l=this._group.options.spiderLegPolylineOptions;for(o._ignoreMove=!0,i=0;i<e.length;i++)s=a.layerPointToLatLng(t[i]),r=e[i],n=new L.Polyline([this._latlng,s],l),a.addLayer(n),r._spiderLeg=n,r._preSpiderfyLatlng=r._latlng,r.setLatLng(s),r.setZIndexOffset&&r.setZIndexOffset(1e6),h.addLayer(r);this.setOpacity(.3),o._ignoreMove=!1,o.fire("spiderfied",{cluster:this,markers:e})},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerCluster.include({_animationSpiderfy:function(e,t){var i,r,n,s,o,a,h=this,l=this._group,u=l._map,_=l._featureGroup,d=this._latlng,c=u.latLngToLayerPoint(d),p=L.Path.SVG,m=L.extend({},this._group.options.spiderLegPolylineOptions),f=m.opacity;for(f===g&&(f=L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),p?(m.opacity=0,m.className=(m.className||"")+" leaflet-cluster-spider-leg"):m.opacity=f,l._ignoreMove=!0,i=0;i<e.length;i++)r=e[i],a=u.layerPointToLatLng(t[i]),n=new L.Polyline([d,a],m),u.addLayer(n),r._spiderLeg=n,p&&(o=(s=n._path).getTotalLength()+.1,s.style.strokeDasharray=o,s.style.strokeDashoffset=o),r.setZIndexOffset&&r.setZIndexOffset(1e6),r.clusterHide&&r.clusterHide(),_.addLayer(r),r._setPos&&r._setPos(c);for(l._forceLayout(),l._animationStart(),i=e.length-1;0<=i;i--)a=u.layerPointToLatLng(t[i]),(r=e[i])._preSpiderfyLatlng=r._latlng,r.setLatLng(a),r.clusterShow&&r.clusterShow(),p&&((s=(n=r._spiderLeg)._path).style.strokeDashoffset=0,n.setStyle({opacity:f}));this.setOpacity(.3),l._ignoreMove=!1,setTimeout(function(){l._animationEnd(),l.fire("spiderfied",{cluster:h,markers:e})},200)},_animationUnspiderfy:function(e){var t,i,r,n,s,o,a=this,h=this._group,l=h._map,u=h._featureGroup,_=e?l._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):l.latLngToLayerPoint(this._latlng),d=this.getAllChildMarkers(),c=L.Path.SVG;for(h._ignoreMove=!0,h._animationStart(),this.setOpacity(1),i=d.length-1;0<=i;i--)(t=d[i])._preSpiderfyLatlng&&(t.closePopup(),t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng,o=!0,t._setPos&&(t._setPos(_),o=!1),t.clusterHide&&(t.clusterHide(),o=!1),o&&u.removeLayer(t),c&&(s=(n=(r=t._spiderLeg)._path).getTotalLength()+.1,n.style.strokeDashoffset=s,r.setStyle({opacity:0})));h._ignoreMove=!1,setTimeout(function(){var e=0;for(i=d.length-1;0<=i;i--)(t=d[i])._spiderLeg&&e++;for(i=d.length-1;0<=i;i--)(t=d[i])._spiderLeg&&(t.clusterShow&&t.clusterShow(),t.setZIndexOffset&&t.setZIndexOffset(0),1<e&&u.removeLayer(t),l.removeLayer(t._spiderLeg),delete t._spiderLeg);h._animationEnd(),h.fire("unspiderfied",{cluster:a,markers:d})},200)}}),L.MarkerClusterGroup.include({_spiderfied:null,unspiderfy:function(){this._unspiderfy.apply(this,arguments)},_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Browser.touch||this._map.getRenderer(this)},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._map.off("zoomend",this._noanimationUnspiderfy,this),this._noanimationUnspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(e){this._spiderfied&&this._spiderfied.unspiderfy(e)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(e){e._spiderLeg&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow(),e.setZIndexOffset&&e.setZIndexOffset(0),this._map.removeLayer(e._spiderLeg),delete e._spiderLeg)}}),L.MarkerClusterGroup.include({refreshClusters:function(e){return e?e instanceof L.MarkerClusterGroup?e=e._topClusterLevel.getAllChildMarkers():e instanceof L.LayerGroup?e=e._layers:e instanceof L.MarkerCluster?e=e.getAllChildMarkers():e instanceof L.Marker&&(e=[e]):e=this._topClusterLevel.getAllChildMarkers(),this._flagParentsIconsNeedUpdate(e),this._refreshClustersIcons(),this.options.singleMarkerMode&&this._refreshSingleMarkerModeMarkers(e),this},_flagParentsIconsNeedUpdate:function(e){var t,i;for(t in e)for(i=e[t].__parent;i;)i._iconNeedsUpdate=!0,i=i.__parent},_refreshSingleMarkerModeMarkers:function(e){var t,i;for(t in e)i=e[t],this.hasLayer(i)&&i.setIcon(this._overrideMarkerIcon(i))}}),L.Marker.include({refreshIconOptions:function(e,t){var i=this.options.icon;return L.setOptions(i,e),this.setIcon(i),t&&this.__parent&&this.__parent._group.refreshClusters(this),this}})}((window,document));
