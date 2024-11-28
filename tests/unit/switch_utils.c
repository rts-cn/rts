/*
 * FreeSWITCH Modular Media Switching Software Library / Soft-Switch Application
 * Copyright (C) 2005-2018, Anthony Minessale II <anthm@freeswitch.org>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is FreeSWITCH Modular Media Switching Software Library / Soft-Switch Application
 *
 * The Initial Developer of the Original Code is
 * Anthony Minessale II <anthm@freeswitch.org>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Seven Du <seven@signalwire.com>
 * Windy Wang <xiaofengcanyuexp@163.com>
 *
 * switch_utils.c -- tests switch_utils
 *
 */

#include <switch.h>
#include <test/switch_test.h>

FST_MINCORE_BEGIN("./conf")

FST_SUITE_BEGIN(switch_hash)

FST_SETUP_BEGIN()
{
}
FST_SETUP_END()

FST_TEARDOWN_BEGIN()
{
}
FST_TEARDOWN_END()

FST_TEST_BEGIN(benchmark)
{
    char encoded[1024];
    char *s = "ABCD";

    switch_url_encode(s, encoded, sizeof(encoded));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "encoded: [%s]\n", encoded);
    fst_check_string_equals(encoded, "ABCD");

    s = "&bryän#!杜金房";
    switch_url_encode(s, encoded, sizeof(encoded));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "encoded: [%s]\n", encoded);
    fst_check_string_equals(encoded, "%26bry%C3%A4n%23!%E6%9D%9C%E9%87%91%E6%88%BF");
}
FST_TEST_END()

FST_TEST_BEGIN(b64)
{
    switch_size_t size;
    char *str = "ABC";
    unsigned char b64_str[6];
    char decoded_str[4];
    switch_status_t status = switch_b64_encode((unsigned char *)str, strlen(str), b64_str, sizeof(b64_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "b64_str: %s\n", b64_str);
    fst_check(status == SWITCH_STATUS_SUCCESS);
    fst_check_string_equals((const char *)b64_str, "QUJD");

    size = switch_b64_decode((const char *)b64_str, decoded_str, sizeof(decoded_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "decoded_str: %s\n", decoded_str);
    fst_check_string_equals(decoded_str, str);
    fst_check(size == 4);
}
FST_TEST_END()

FST_TEST_BEGIN(b64_pad2)
{
    switch_size_t size;
    char str[] = {0, 0, 0, 0};
    unsigned char b64_str[128];
    char decoded_str[128];
	int i;
    switch_status_t status = switch_b64_encode((unsigned char *)str, sizeof(str), b64_str, sizeof(b64_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "b64_str: %s\n", b64_str);
    fst_check(status == SWITCH_STATUS_SUCCESS);
    fst_check_string_equals((const char *)b64_str, "AAAAAA==");
    size = switch_b64_decode((const char *)b64_str, decoded_str, sizeof(decoded_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "decoded_str: %s\n", decoded_str);
    fst_check_string_equals(decoded_str, str);
    fst_check(size == sizeof(str) + 1);
	for (i = 0; i < sizeof(str); i++) {
		fst_check(decoded_str[i] == str[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(b64_pad1)
{
    switch_size_t size;
    char str[] = {0, 0, 0, 0, 0};
    unsigned char b64_str[128];
    char decoded_str[128];
	int i;
    switch_status_t status = switch_b64_encode((unsigned char *)str, sizeof(str), b64_str, sizeof(b64_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "b64_str: %s\n", b64_str);
    fst_check(status == SWITCH_STATUS_SUCCESS);
    fst_check_string_equals((const char *)b64_str, "AAAAAAA=");
    size = switch_b64_decode((const char *)b64_str, decoded_str, sizeof(decoded_str));
    switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "decoded_str: %s\n", decoded_str);
    fst_check_string_equals(decoded_str, str);
    fst_check(size == sizeof(str) + 1);
		for (i = 0; i < sizeof(str); i++) {
		fst_check(decoded_str[i] == str[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(test_sanitize_number)
{
	char number[128];

	switch_set_string(number, "1234@example.com");
	switch_sanitize_number(number);
	fst_check_string_equals(number, "1234");
	switch_set_string(number, "1234%example.com");
	switch_sanitize_number(number);
	fst_check_string_equals(number, "1234");
}
FST_TEST_END()

FST_TEST_BEGIN(test_split_cheap1)
{
	const char *str = "1234,5678,90123";
	int argc;
	const char *argv[4];
	unsigned int largv[4] = {0};
	int i;

	argc = switch_split_cheap(str, ',', argv, largv);
	fst_check_int_equals(argc, 3);
	fst_check_int_equals(largv[0], 4);
	fst_check_int_equals(largv[1], 4);
	fst_check_int_equals(largv[2], 5);
	fst_check_int_equals(largv[3], 0);
	for (i = 0; i < argc; i++) {
		printf("%.*s\n", largv[i], argv[i]);
		switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "%.*s\n", largv[i], argv[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(test_split_cheap2)
{
	const char *str = "1234,5678,90123,";
	int argc;
	const char *argv[4];
	unsigned int largv[4] = {0};
	int i;

	argc = switch_split_cheap(str, ',', argv, largv);
	fst_check_int_equals(argc, 3);
	fst_check_int_equals(largv[0], 4);
	fst_check_int_equals(largv[1], 4);
	fst_check_int_equals(largv[2], 5);
	fst_check_int_equals(largv[3], 0);
	for (i = 0; i < argc; i++) {
		printf("%.*s\n", largv[i], argv[i]);
		switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "%.*s\n", largv[i], argv[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(test_split_cheap3)
{
	const char *str = "1234 5678 90123";
	int argc;
	const char *argv[4];
	unsigned int largv[4] = {0};
	int i;

	argc = switch_split_cheap(str, ' ', argv, largv);
	fst_check_int_equals(argc, 3);
	fst_check_int_equals(largv[0], 4);
	fst_check_int_equals(largv[1], 4);
	fst_check_int_equals(largv[2], 5);
	fst_check_int_equals(largv[3], 0);
	for (i = 0; i < argc; i++) {
		printf("%.*s\n", largv[i], argv[i]);
		switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "%.*s\n", largv[i], argv[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(test_split_cheap4)
{
	const char *str = "1234 5678 90123 ";
	int argc;
	const char *argv[4];
	unsigned int largv[4] = {0};
	int i;

	argc = switch_split_cheap(str, ' ', argv, largv);
	fst_check_int_equals(argc, 3);
	fst_check_int_equals(largv[0], 4);
	fst_check_int_equals(largv[1], 4);
	fst_check_int_equals(largv[2], 5);
	fst_check_int_equals(largv[3], 0);
	for (i = 0; i < argc; i++) {
		printf("%.*s\n", largv[i], argv[i]);
		switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "%.*s\n", largv[i], argv[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(test_split_cheap5)
{
	const char *str = "1234 5678 90123     ";
	int argc;
	const char *argv[4];
	unsigned int largv[4] = {0};
	int i;

	argc = switch_split_cheap(str, ' ', argv, largv);
	fst_check_int_equals(argc, 3);
	fst_check_int_equals(largv[0], 4);
	fst_check_int_equals(largv[1], 4);
	fst_check_int_equals(largv[2], 5);
	fst_check_int_equals(largv[3], 0);
	for (i = 0; i < argc; i++) {
		printf("%.*s\n", largv[i], argv[i]);
		switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "%.*s\n", largv[i], argv[i]);
	}
}
FST_TEST_END()

FST_TEST_BEGIN(jwt)
{
	char *token = "token";
	char *secret = "secret";
	cJSON *user_id;
	char *str_payload;
	char *signed_token;
	cJSON *payload = switch_jwt_verify(secret, token);
	fst_check(payload == NULL);

	token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHBpcmVzIjoxNTg5NzA2OTUyfQ.O0Aa8RSoQ4DwEpl8FyKbcbKUadXePAPleJqciwjfFXw";
	payload = switch_jwt_verify("invalid_secret", token);
	fst_check(payload == NULL);

	payload = switch_jwt_verify(secret, token);
	fst_requires(payload);
	user_id = cJSON_GetObjectItem(payload, "user_id");
	fst_check(user_id && user_id->type == cJSON_Number && user_id->valueint == 1);

	str_payload = cJSON_Print(payload);
	cJSON_Delete(payload);

	fst_requires(str_payload);
	signed_token = switch_jwt_sign(secret, (const uint8_t *)str_payload, strlen(str_payload));
	free(str_payload);
	str_payload = NULL;
	fst_requires(signed_token);
	switch_log_printf(SWITCH_CHANNEL_LOG, SWITCH_LOG_INFO, "signed token: %s\n", signed_token);
	payload = switch_jwt_verify(secret, signed_token);
	free(signed_token);
	signed_token = NULL;
	fst_requires(payload);
	user_id = cJSON_GetObjectItem(payload, "user_id");
	fst_check(user_id && user_id->type == cJSON_Number && user_id->valueint == 1);
	cJSON_Delete(payload);

}
FST_TEST_END()

FST_SUITE_END()

FST_MINCORE_END()

/* For Emacs:
 * Local Variables:
 * mode:c
 * indent-tabs-mode:t
 * tab-width:4
 * c-basic-offset:4
 * End:
 * For VIM:
 * vim:set softtabstop=4 shiftwidth=4 tabstop=4 noet:
 */
