
/**
 * 当桥接对象注入完毕时的回调
 * @param callBack     Function = () => {}
 */
function RF_OnReady(callBack) {

    if (window.RFBridge) {
        alert("成功");
        callBack && callBack();

    }
    else {
        window.__onFinishInject = function() {
            alert("失败");
            callBack && callBack();
            window.__onFinishInject = null;

        };
    }
}

/**
 * RF_GetOpenUID
 * 获取用户信息 open_id、nick_name
 * @param clientTicket  第三方应用获取的临时令牌
 *
 * @param onError       失败回调    Function = (errorMsg: string) => {}
 * @param onSuccess     成功回调    Function = {open_id: xxx, nick_name: xxx} => {}
 */
function RF_GetOpenUID(clientTicket, onError, onSuccess) {
    try {
        window.__onGetOpenUid = function(error, info) {
            if (error) {
                onError && onError(error);
            }
            else {
                if (typeof info == 'string') {
                    onSuccess && onSuccess(JSON.parse(info));
                }
                else {
                    onSuccess && onSuccess(info);
                }
            }
        };
        RFBridge.RFN_GetOpenUIDWithTicketCallbackFunctionName(clientTicket, '__onGetOpenUid');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}

/**
 * RF_PayOrder
 * 支付宝、微信 支付
 * @param openID            用户openID
 * @param outTradeNO        后台生成的订单号
 * @param communityTradeNO  用户所在社区单号
 *
 * @param onError           失败回调    Function = (errorMsg: string) => {}
 * @param onSuccess         成功回调    Function = () => {}
 * @constructor
 */
function RF_PayOrder(openID, outTradeNO, communityTradeNO, onError, onSuccess) {
    try {
        window.__onPayFinish = function(error) {
            if (error) {
                onError && onError(error);
            }
            else {
                onSuccess && onSuccess();
            }
        };
        RFBridge.RFN_PayOrderWithOpenIDOutTradeNOCommunityTradeNOCallbackFunctionName(openID, outTradeNO, communityTradeNO, '__onPayFinish');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}

/**
 * RF_GetCommunityID
 * 获取当前社区ID
 *
 * @param onError   失败回调    Function = (errorMsg: string) => {}
 * @param onSuccess 成功回调    Function = communityID => {}     (社区ID)
 */
function RF_GetCommunityID(onError, onSuccess) {
    try {
        window.__onGetCommunityID = function(error, communityID) {
            if (error) {
                onError && onError(error);
            }
            else {
                onSuccess && onSuccess(communityID);
            }
        };
        RFBridge.RFN_GetCommunityIDWithCallbackFunctionName('__onGetCommunityID');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}

/**
 * RF_GetPhotos
 * 选择图片
 * @param count     选择照片的最大数量
 *
 * @param onError   失败回调    Function = (errorMsg: string) => {}
 * @param onSuccess 成功回调    Function = [base64String: string] => {}     (图片的base64字符串数组)
 */
function RF_GetPhotos(count, onError, onSuccess) {
    try {
        window.__onGetPhotos = function(error, jsonPhotoArray) {
            if (error) {
                onError && onError(error);
            }
            else {
                const photos = JSON.parse(jsonPhotoArray);
                onSuccess && onSuccess(photos.map(function(base64) {
                    return 'data:image/jpeg;base64,' + base64;
                }));
            }
        };
        RFBridge.RFN_GetUserPhotoMaxCallbackFunctionName(count, '__onGetPhotos');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}

/**
 * RF_GetQRCode
 * 调用摄像头 扫描二维码
 *
 * @param onError    失败回调    Function = (errorMsg: string) => {}
 * @param onSuccess  成功回调    Function = (qrCode: string) => {}      (二维码字符串)
 */
function RF_GetQRCode(onError, onSuccess) {
    try {
        window.__GetQRCode = function(error, qrCode) {
            if (error) {
                onError && onError(error);
            }
            else {
                onSuccess && onSuccess(qrCode);
            }
        };
        RFBridge.RFN_GetQRCodeWithCallbackFunctionName('__GetQRCode');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}

/**
 * 获取定位 百度地图坐标系经纬度{lat, lng}
 * @param onError       Function = errorMsg => {}
 * @param onSuccess     Function = {lat: xxx, lng: xxx} => {}
 */
function RF_GetLocation(onError, onSuccess) {
    try {
        window.__onGetLocation = function(error, location) {
            if (error) {
                onError && onError(error);
            }
            else {
                onSuccess && onSuccess(JSON.parse(location));
            }
        };
        RFBridge.RFN_GetGPSWithCallbackFunctionName('__onGetLocation');
    }
    catch (error) {
        onError && onError('没有注入对象');
    }
}