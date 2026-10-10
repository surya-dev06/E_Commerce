insert into public.categories(name,slug,description) values
('Laptops','laptops','Powerful laptops for work, study and play.'),
('Smartphones','smartphones','Fast and stylish smartphones.'),
('Audio','audio','Headphones, earbuds and speakers.'),
('Wearables','wearables','Smart watches and fitness devices.'),
('Gaming','gaming','Controllers, consoles and accessories.'),
('Monitors','monitors','Immersive displays for work and gaming.'),
('Smart Home','smart-home','Connected devices for a smarter home.');

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'NovaBook Pro 14','novabook-pro-14','Voltix','A premium performance laptop with a bright display, fast processor and all-day battery.','Pro performance for everyday work.','VX-LAP-001',89999,104999,20,4.8,128,true,true,'/images/laptop.svg'
from public.categories c where c.slug='laptops';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'Vista X Smartphone','vista-x-smartphone','Voltix','A modern smartphone with an immersive display, flagship camera and fast charging.','Smart power in your pocket.','VX-PHN-001',69999,75999,35,4.7,210,true,true,'/images/phone.svg'
from public.categories c where c.slug='smartphones';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'Pulse Buds Pro','pulse-buds-pro','Voltix','Premium wireless earbuds with adaptive noise cancellation and rich sound.','Sound reimagined.','VX-AUD-001',12999,14999,50,4.6,96,true,true,'/images/headphones.svg'
from public.categories c where c.slug='audio';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'TrackFit Elite','trackfit-elite','Voltix','Advanced smartwatch for activity tracking, calls and everyday notifications.','Your health, connected.','VX-WAT-001',19999,23999,28,4.7,74,true,true,'/images/watch.svg'
from public.categories c where c.slug='wearables';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'PlayMax Controller','playmax-controller','Voltix','Precision wireless gaming controller with low-latency controls.','Level up your game.','VX-GAM-001',6999,7999,80,4.5,58,false,true,'/images/controller.svg'
from public.categories c where c.slug='gaming';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'HomeCam 360','homecam-360','Voltix','Smart indoor security camera with 360-degree coverage and app controls.','Smarter security at home.','VX-SHM-001',8999,9999,45,4.4,112,true,true,'/images/camera.svg'
from public.categories c where c.slug='smart-home';

insert into public.products
(category_id,name,slug,brand,description,short_description,sku,price,compare_at_price,stock,rating,review_count,is_featured,is_trending,image_url)
select c.id,'Vision 27 Monitor','vision-27-monitor','Voltix','Crisp 27-inch monitor for creative work and gaming.','A bigger, brighter workspace.','VX-MON-001',24999,29999,24,4.6,87,true,false,'/images/monitor.svg'
from public.categories c where c.slug='monitors';
