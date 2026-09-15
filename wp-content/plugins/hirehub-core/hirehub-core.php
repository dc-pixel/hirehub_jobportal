<?php
/**
 * Plugin Name: HireHub Core
 * Description: Core job portal functionality for the HireHub WordPress theme.
 * Version: 1.0.0
 * Author: HireHub
 * Text Domain: hirehub
 */
if (!defined('ABSPATH')) exit;

define('HIREHUB_VERSION', '1.0.0');
define('HIREHUB_PLUGIN_DIR', plugin_dir_path(__FILE__));

register_activation_hook(__FILE__, 'hirehub_activate');
function hirehub_activate() {
    hirehub_register_roles();
    hirehub_register_post_types();
    hirehub_create_application_table();
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, function(){ flush_rewrite_rules(); });

require_once HIREHUB_PLUGIN_DIR . 'includes/roles.php';
require_once HIREHUB_PLUGIN_DIR . 'includes/post-types.php';
require_once HIREHUB_PLUGIN_DIR . 'includes/applications.php';
require_once HIREHUB_PLUGIN_DIR . 'includes/shortcodes.php';
require_once HIREHUB_PLUGIN_DIR . 'includes/ajax.php';
require_once HIREHUB_PLUGIN_DIR . 'includes/rest.php';

add_action('init', 'hirehub_register_post_types');
add_action('init', 'hirehub_register_roles', 20);
add_action('wp_enqueue_scripts', function(){
    wp_enqueue_style('hirehub-core', plugins_url('assets/hirehub-core.css', __FILE__), array(), HIREHUB_VERSION);
    wp_enqueue_script('hirehub-core', plugins_url('assets/hirehub-core.js', __FILE__), array('jquery'), HIREHUB_VERSION, true);
    wp_localize_script('hirehub-core', 'HireHub', array('ajaxUrl' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('hirehub_ajax')));
});
