-- +goose Up
begin;

alter table expected
add column notes varchar(512);

end;

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
begin;

alter table expected
drop column notes;

end;
