import { test, expect } from '@playwright/test';

// Controlled API responses and a Leaflet spy: these tests are not live inference
// or a substitute for visual verification with the real Leaflet renderer.
test('contract, switching trips, duplicate prevention, retry and connection failure', async ({page}) => {
 await page.route('https://**/*', route => route.abort());
 await page.addInitScript(() => {
   window.drawn = []; window.fits = [];
   const group = () => ({addTo(){return this},clearLayers(){window.drawn=[]}});
   const map = {setView(){return this}, fitBounds(b){window.fits.push(b);return this},removeLayer(){}};
   window.L = {
     map:()=>map,featureGroup:group,tileLayer:()=>({addTo(){return this},on(){return this}}),
     latLngBounds:p=>p,
     polyline:(p)=>({addTo(){window.drawn.push({type:'route',p})}}),
     circleMarker:(p)=>({addTo(){window.drawn.push({type:'gps',p})}}),
   };
 });
 let calls = 0, fail = false;
 await page.route('http://127.0.0.1:8000/**', async route => {
   const path = new URL(route.request().url()).pathname;
   if(path==='/health') return route.fulfill({json:{status:'ready',trip_count:2}});
   if(path==='/trips') return route.fulfill({json:{trip_ids:['0001','0099']}});
   calls++;
   expect(route.request().method()).toBe('POST');
   expect(route.request().postData()).toBeNull();
   await new Promise(r=>setTimeout(r,250));
   if(fail) return route.fulfill({status:500,json:{detail:'Trip data or scoring is unavailable'}});
   const id = path.split('/')[2], second = id==='0099', x=second?80:77;
   return route.fulfill({json:{trip_id:id,observation_count:1,observations:[[x,12,123]],
    predicted_route:[{arc_id:1,coordinates:[[x,12],[x+.01,12.01]]},{arc_id:7,coordinates:[[x+.1,12.1],[x+.11,12.11]]}],
    metrics:{pointwise_accuracy:second?.5:.9,processing_seconds:second?2:1}}});
 });
 await page.goto('/');
 await expect(page.locator('#trip')).toHaveValue('0001');
 await page.locator('#run').click();
 await expect(page.locator('#run')).toBeDisabled();
 await expect(page.locator('#accuracy')).toHaveText('90.0%');
 expect(calls).toBe(1);
 expect(await page.evaluate(()=>window.drawn.filter(x=>x.type==='route').length)).toBe(2);
 expect(await page.evaluate(()=>window.drawn.find(x=>x.type==='gps').p)).toEqual([12,77]);
 await page.locator('#trip').selectOption('0099');
 await expect(page.locator('#accuracy')).toHaveText('—');
 expect(await page.evaluate(()=>window.drawn)).toEqual([]);
 await page.locator('#run').click();
 await expect(page.locator('#accuracy')).toHaveText('50.0%');
 await expect(page.locator('#seconds')).toHaveText('2.000 s');
 await expect(page.locator('#count')).toHaveText('1');
 expect(await page.evaluate(()=>window.fits.at(-1).at(-1))).toEqual([12,80]);
 fail=true;
 await page.locator('#run').click();
 await expect(page.locator('#status')).toContainText('retry');
 await expect(page.locator('#accuracy')).toHaveText('—');
 await expect(page.locator('#run')).toBeEnabled();
 fail=false; await page.locator('#run').click();
 await expect(page.locator('#accuracy')).toHaveText('50.0%');
 await page.locator('#base').fill('http://127.0.0.1:8999');
 await page.locator('#connect').click();
 await expect(page.locator('#connection-note')).toContainText('Cannot reach API');
 await expect(page.locator('#run')).toBeDisabled();
});
