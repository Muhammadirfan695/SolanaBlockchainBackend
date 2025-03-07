export async function generateDeviceId(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency,
    screen.colorDepth,
    screen.width,
    screen.height
  ];

  const deviceString = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(deviceString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  return hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}