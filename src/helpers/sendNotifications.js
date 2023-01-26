import fetch from 'node-fetch';
import { url } from '../config';
import { pushNotificationMessage } from './pushNotificationMessage';

export async function sendNotifications(actionType, notifyContent, notifyUserId) {

    const { title, message } = await pushNotificationMessage(actionType, notifyContent);
    let content = notifyContent;
    content['title'] = title;
    content['message'] = message;

    console.log('node fetch', content);    

    const resp = await fetch(url + '/push-notification', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content,
            userId: notifyUserId
        }),
        credentials: 'include'
    });
    
    const { status, errorMessge } = resp.json;   

    return await {
        status,
        errorMessge
    };
    
}

export default {
    sendNotifications
}
