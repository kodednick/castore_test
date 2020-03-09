window.theme = window.theme || {};

/**
 * Header actions
 */
theme.headerFunctions = (function() {

	var selectors = {
		searchTrigger: '.search-trigger',
		searchBarClose: '.search-bar__close',
	};

	function openSearch() {
		$('body').addClass('search-bar-active');
	}

	function closeSearch() {
		$('body').removeClass('search-bar-active');
	}

	function initEventListeners() {
		$(selectors.searchTrigger).on('click', openSearch);
		$(selectors.searchBarClose).on('click', closeSearch);
	}

	return {
		init: function() {
			initEventListeners();
		}
	};

})();

/**
 * Custom actions
 */
theme.customerTemplates = (function() {

	var selectors = {
		RecoverHeading: '#RecoverHeading',
		RecoverEmail: '#RecoverEmail',
		LoginHeading: '#LoginHeading'
	};

	function initEventListeners() {
		this.$RecoverHeading = $(selectors.RecoverHeading);
		this.$RecoverEmail = $(selectors.RecoverEmail);
		this.$LoginHeading = $(selectors.LoginHeading);

		// Show reset password form
		$('#RecoverPassword').on(
			'click',
			function(evt) {
				evt.preventDefault();
				showRecoverPasswordForm();
				this.$RecoverHeading.attr('tabindex', '-1').focus();
			}.bind(this)
		);

		// Hide reset password form
		$('#HideRecoverPasswordLink').on(
			'click',
			function(evt) {
				evt.preventDefault();
				hideRecoverPasswordForm();
				this.$LoginHeading.attr('tabindex', '-1').focus();
			}.bind(this)
		);

		this.$RecoverHeading.on('blur', function() {
			$(this).removeAttr('tabindex');
		});

		this.$LoginHeading.on('blur', function() {
			$(this).removeAttr('tabindex');
		});
	}

	/**
	 *
	 *  Show/Hide recover password form
	 *
	 */
	function showRecoverPasswordForm() {
		$('#RecoverPasswordForm').removeClass('hide');
		$('#CustomerLoginForm').addClass('hide');

		if (this.$RecoverEmail.attr('aria-invalid') === 'true') {
			this.$RecoverEmail.focus();
		}
	}

	function hideRecoverPasswordForm() {
		$('#RecoverPasswordForm').addClass('hide');
		$('#CustomerLoginForm').removeClass('hide');
	}

	/**
	 *
	 *  Show reset password success message
	 *
	 */
	function resetPasswordSuccess() {
		var $formState = $('.reset-password-success');

		// check if reset password form was successfully submited.
		if (!$formState.length) {
			return;
		}

		// show success message
		$('#ResetSuccess')
			.removeClass('hide')
			.focus();
	}

	/**
	 *  Show/hide customer address forms
	 */
	function customerAddressForm() {
		var $newAddressForm = $('#AddressNewForm');
		var $newAddressFormButton = $('#AddressNewButton');

		if (!$newAddressForm.length) {
			return;
		}

		// Initialize observers on address selectors, defined in shopify_common.js
		if (Shopify) {
			// eslint-disable-next-line no-new
			new Shopify.CountryProvinceSelector(
				'AddressCountryNew',
				'AddressProvinceNew',
				{
					hideElement: 'AddressProvinceContainerNew'
				}
			);
		}

		// Initialize each edit form's country/province selector
		$('.address-country-option').each(function() {
			var formId = $(this).data('form-id');
			var countrySelector = 'AddressCountry_' + formId;
			var provinceSelector = 'AddressProvince_' + formId;
			var containerSelector = 'AddressProvinceContainer_' + formId;

			// eslint-disable-next-line no-new
			new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
				hideElement: containerSelector
			});
		});

		// Toggle new/edit address forms
		$('.address-new-toggle').on('click', function() {
			var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

			$newAddressForm.toggleClass('hide');
			$newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
		});

		$('.address-edit-toggle').on('click', function() {
			var formId = $(this).data('form-id');
			var $editButton = $('#EditFormButton_' + formId);
			var $editAddress = $('#EditAddress_' + formId);
			var isExpanded = $editButton.attr('aria-expanded') === 'true';

			$editAddress.toggleClass('hide');
			$editButton.attr('aria-expanded', !isExpanded).focus();
		});

		$('.address-delete').on('click', function() {
			var $el = $(this);
			var target = $el.data('target');
			var confirmMessage = $el.data('confirm-message');

			// eslint-disable-next-line no-alert
			if (
				confirm(
					confirmMessage || 'Are you sure you wish to delete this address?'
				)
			) {
				Shopify.postLink(target, {
					parameters: { _method: 'delete' }
				});
			}
		});
	}

	/**
	 *
	 *  Check URL for reset password hash
	 *
	 */
	function checkUrlHash() {
		var hash = window.location.hash;

		// Allow deep linking to recover password form
		if (hash === '#recover') {
			showRecoverPasswordForm.bind(this)();
		}
	}

	return {
		init: function() {
			initEventListeners();
			checkUrlHash();
			resetPasswordSuccess();
			customerAddressForm();
		}
	};

})();

theme.init = function() {
	theme.headerFunctions.init();
	theme.customerTemplates.init();

	$('a[href="#"]').on('click', function(evt) {
		evt.preventDefault();
	});
};

$(theme.init);
