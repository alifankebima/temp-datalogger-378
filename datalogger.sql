create table if not exists tempdata(
    id integer primary key autoincrement not null,
    title text,
    subtitle text,
    t1 real,
    t2 real,
    t3 real,
    t4 real,
    created_at integer,
    deleted_at integer
)