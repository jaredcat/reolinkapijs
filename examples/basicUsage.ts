import reolinkapi from 'reolinkapi';

const cam = reolinkapi.Camera('192.168.0.102', (deferLogin = True));

// must first login since I defer have deferred the login process
cam.login();

const dst = cam.get_dst();
const ok = cam.add_user('foo', 'bar', 'admin');
const alarm = cam.get_alarm_motion();
cam.set_device_name((name = 'my_camera'));
