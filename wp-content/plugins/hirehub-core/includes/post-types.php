<?php
if (!defined('ABSPATH')) exit;
function hirehub_register_post_types() {
    register_post_type('hirehub_job', array(
        'labels'=>array('name'=>'Jobs','singular_name'=>'Job','add_new_item'=>'Add New Job','edit_item'=>'Edit Job'),
        'public'=>true,'show_in_rest'=>true,'menu_icon'=>'dashicons-businessperson','supports'=>array('title','editor','thumbnail','author'),'has_archive'=>true,
        'rewrite'=>array('slug'=>'jobs'),'capability_type'=>'post'
    ));
    register_taxonomy('hirehub_job_type','hirehub_job',array('label'=>'Job Types','public'=>true,'show_in_rest'=>true,'hierarchical'=>false,'rewrite'=>array('slug'=>'job-type')));
    register_taxonomy('hirehub_location','hirehub_job',array('label'=>'Locations','public'=>true,'show_in_rest'=>true,'hierarchical'=>false,'rewrite'=>array('slug'=>'location')));
}

add_action('add_meta_boxes', function(){ add_meta_box('hirehub_job_details','HireHub Job Details','hirehub_job_meta_box','hirehub_job','normal','high'); });
function hirehub_job_meta_box($post) {
    wp_nonce_field('hirehub_save_job','hirehub_job_nonce');
    $fields=array('salary'=>'Salary','experience'=>'Experience','company'=>'Company','deadline'=>'Application Deadline','skills'=>'Skills');
    echo '<div class="hirehub-admin-fields">';
    foreach($fields as $key=>$label){ $value=get_post_meta($post->ID,'_'.$key,true); echo '<p><label><strong>'.esc_html($label).'</strong><br><input type="text" name="hirehub_'.$key.'" value="'.esc_attr($value).'" style="width:100%"></label></p>'; }
    echo '</div>';
}
add_action('save_post_hirehub_job', function($post_id){
    if(!isset($_POST['hirehub_job_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['hirehub_job_nonce'])),'hirehub_save_job')) return;
    if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if(!current_user_can('edit_post',$post_id)) return;
    foreach(array('salary','experience','company','deadline','skills') as $key){ if(isset($_POST['hirehub_'.$key])) update_post_meta($post_id,'_'.$key,sanitize_text_field(wp_unslash($_POST['hirehub_'.$key]))); }
});
