#!/bin/bash
read -p "Database: " DATABASE
read -p "User: " USER
read -sp "Password: " PASSWORD

mysqldump -u $USER -p$PASSWORD --no-data $DATABASE > schema.sql; \
mysqldump -u $USER -p$PASSWORD --no-create-info $DATABASE \
battle_effects_values \
battle_style_values \
effect_volume_values \
music_volume_values \
pokemon_cries_values \
text_speed_values >> schema.sql

echo ""
