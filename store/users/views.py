from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render

from .forms import UserLoginForm, UserRegistrationForm


def user_register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,
                             'Регистрация прошла успешно. Теперь вы можете войти.')
            return redirect('home')
        error_messages = []
        for field, errors in form.errors.items():
            for error in errors:
                error_messages.append(f'{form.fields[field].label}: {error}')  # noqa: PERF401
        error_message = '\n'.join(error_messages)
        messages.error(request,
                       f'Пожалуйста, исправьте следующие ошибки:\n{error_message}')
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            messages.error(request, 'Неверное имя пользователя или пароль')
        messages.error(request, 'Неверное имя пользователя или пароль')
    else:
        form = UserLoginForm()
    return render(request, 'login.html', {'form': form})


