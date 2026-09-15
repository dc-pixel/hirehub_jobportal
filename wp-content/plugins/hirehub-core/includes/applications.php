<?php
if (!defined('ABSPATH')) exit;
function hirehub_create_application_table(){
 global $wpdb; $table=$wpdb->prefix.'hirehub_applications'; $charset=$wpdb->get_charset_collate();
 $sql="CREATE TABLE $table (id bigint unsigned NOT NULL AUTO_INCREMENT, job_id bigint unsigned NOT NULL, candidate_id bigint unsigned NOT NULL, resume_url text NOT NULL, cover_letter text, status varchar(30) NOT NULL DEFAULT 'applied', created_at datetime NOT NULL, PRIMARY KEY(id), KEY job_id(job_id), KEY candidate_id(candidate_id), KEY status(status)) $charset;";
 require_once ABSPATH.'wp-admin/includes/upgrade.php'; dbDelta($sql);
}
function hirehub_submit_application($job_id,$candidate_id,$resume_url,$cover_letter){
 global $wpdb; $table=$wpdb->prefix.'hirehub_applications';
 if($wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE job_id=%d AND candidate_id=%d",$job_id,$candidate_id))) return new WP_Error('duplicate','You have already applied for this job.');
 return $wpdb->insert($table,array('job_id'=>$job_id,'candidate_id'=>$candidate_id,'resume_url'=>$resume_url,'cover_letter'=>$cover_letter,'status'=>'applied','created_at'=>current_time('mysql')),array('%d','%d','%s','%s','%s','%s')) ? true : new WP_Error('db_error','Could not save application.');
}
function hirehub_get_candidate_applications($candidate_id){ global $wpdb; $table=$wpdb->prefix.'hirehub_applications'; return $wpdb->get_results($wpdb->prepare("SELECT * FROM $table WHERE candidate_id=%d ORDER BY created_at DESC",$candidate_id)); }
