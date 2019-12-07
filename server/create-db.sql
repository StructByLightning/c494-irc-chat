create table if not exists rooms (roomId text, roomName text, ephemeral text);
insert into rooms(roomId, roomName, ephemeral) values ('00000000-01bf-11ea-a69e-362b9e155667', 'Default', 'false');
insert into rooms(roomId, roomName, ephemeral) values ('10000000-01bf-11ea-a69e-362b9e155667', 'Custom 1', 'false');
insert into rooms(roomId, roomName, ephemeral) values ('20000000-01bf-11ea-a69e-362b9e155667', 'Custom 2', 'false');
insert into rooms(roomId, roomName, ephemeral) values ('30000000-01bf-11ea-a69e-362b9e155667', 'Custom 3', 'false');

create table if not exists clientInRoom(clientId, roomId);
create table if not exists clients(clientId text, clientName text);

create table if not exists messages(messageId text, roomId text, ownerId text, ownerName text, content text, timestamp text);
