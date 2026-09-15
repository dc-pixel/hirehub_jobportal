<?php
if (!defined('ABSPATH')) exit;
function hirehub_register_roles() {
    add_role('hirehub_candidate', 'Candidate', array('read'=>true, 'upload_files'=>true));
    add_role('hirehub_recruiter', 'Recruiter', array('read'=>true, 'upload_files'=>true, 'publish_posts'=>false));
}
