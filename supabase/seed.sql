-- Demo seed. Replace with verified company/product data before production.
insert into categories (slug,name_vi,name_en,description_vi,description_en,sort_order) values
('ong-thep-phu-kien','Ống thép và phụ kiện ống','Steel Pipes & Fittings','Ống và phụ kiện phục vụ hệ thống đường ống công nghiệp.','Pipes and fittings for industrial piping systems.',1),
('van-cong-nghiep','Van cơ khí và van điều khiển','Industrial & Control Valves','Các dòng van công nghiệp cho nhiều ứng dụng vận hành.','Industrial valves for a range of operating applications.',2),
('thiet-bi-bon-xang-dau','Van an toàn và thiết bị bồn xăng dầu','Tank Safety Equipment','Thiết bị bảo vệ, an toàn cho bồn chứa và hệ thống phụ trợ.','Protection and safety equipment for storage tanks and systems.',3),
('thiet-bi-do','Thiết bị đo và giảm áp','Measurement & Pressure Control','Thiết bị đo lường và kiểm soát áp suất.','Instrumentation and pressure control equipment.',4),
('thiet-bi-pccc','Thiết bị báo cháy','Fire Detection Equipment','Thiết bị phục vụ hệ thống cảnh báo và PCCC.','Equipment for fire detection and protection systems.',5),
('bom-may-nen','Bơm và máy nén khí','Pumps & Compressors','Giải pháp bơm và khí nén cho môi trường công nghiệp.','Pumping and compressed-air solutions for industrial environments.',6),
('lpg','Ống mềm và máy nạp LPG','LPG Hoses & Filling Equipment','Thiết bị phục vụ hệ thống LPG và nạp khí.','Equipment for LPG systems and filling applications.',7),
('vong-dem','Vòng đệm','Gaskets','Vòng đệm và vật tư làm kín cho thiết bị, đường ống.','Gaskets and sealing materials for equipment and piping.',8)
on conflict (slug) do nothing;

insert into company_settings (singleton, company_name_vi, company_name_en, description_vi, description_en, email, website, address_vi, address_en)
values (true,
'CÔNG TY TNHH KHANG ANH QUÂN',
'KHANG ANH QUAN CO., LTD.',
'Khang Anh Quân chuyên cung cấp thiết bị, vật tư và giải pháp phục vụ các ngành công nghiệp, dầu khí, LPG, PCCC và hệ thống đường ống.',
'Khang Anh Quan supplies equipment, materials and solutions for industrial, oil & gas, LPG, fire protection and piping systems.',
'sales@kaq.com.vn', 'www.khanganhquan.com',
'39/1 Nguyễn Cửu Đàm, Phường Tân Sơn Nhì, Quận Tân Phú, TP. Hồ Chí Minh, Việt Nam',
'39/1 Nguyen Cuu Dam, Tan Son Nhi Ward, Tan Phu District, Ho Chi Minh City, Vietnam')
on conflict (singleton) do update set company_name_vi=excluded.company_name_vi, company_name_en=excluded.company_name_en, description_vi=excluded.description_vi, description_en=excluded.description_en, email=excluded.email, website=excluded.website, address_vi=excluded.address_vi, address_en=excluded.address_en;


-- After creating an admin user in Supabase Auth, run:
-- insert into public.profiles (id, full_name, role) values ('AUTH-USER-UUID', 'KAQ Admin', 'admin') on conflict (id) do update set role='admin';
