#!/usr/bin/env python3
"""
간단한 계산기 프로그램
Simple Calculator Program
"""

import sys


def add(x, y):
    """덧셈"""
    return x + y


def subtract(x, y):
    """뺄셈"""
    return x - y


def multiply(x, y):
    """곱셈"""
    return x * y


def divide(x, y):
    """나눗셈"""
    if y == 0:
        raise ValueError("0으로 나눌 수 없습니다.")
    return x / y


def power(x, y):
    """거듭제곱"""
    return x ** y


def get_number(prompt):
    """숫자 입력 받기"""
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("올바른 숫자를 입력하세요.")


def main():
    """메인 계산기 함수"""
    print("=" * 50)
    print("계산기 프로그램".center(50))
    print("=" * 50)
    
    while True:
        print("\n연산을 선택하세요:")
        print("1. 덧셈 (+)")
        print("2. 뺄셈 (-)")
        print("3. 곱셈 (*)")
        print("4. 나눗셈 (/)")
        print("5. 거듭제곱 (^)")
        print("0. 종료")
        
        choice = input("\n선택 (0-5): ").strip()
        
        if choice == '0':
            print("\n계산기를 종료합니다. 감사합니다!")
            sys.exit(0)
        
        if choice not in ['1', '2', '3', '4', '5']:
            print("올바른 선택이 아닙니다. 다시 선택해주세요.")
            continue
        
        # 숫자 입력 받기
        num1 = get_number("첫 번째 숫자를 입력하세요: ")
        num2 = get_number("두 번째 숫자를 입력하세요: ")
        
        try:
            if choice == '1':
                result = add(num1, num2)
                operation = "+"
            elif choice == '2':
                result = subtract(num1, num2)
                operation = "-"
            elif choice == '3':
                result = multiply(num1, num2)
                operation = "*"
            elif choice == '4':
                result = divide(num1, num2)
                operation = "/"
            elif choice == '5':
                result = power(num1, num2)
                operation = "^"
            
            print(f"\n결과: {num1} {operation} {num2} = {result}")
            
        except ValueError as e:
            print(f"\n오류: {e}")
        except Exception as e:
            print(f"\n예상치 못한 오류가 발생했습니다: {e}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n계산기를 종료합니다. 감사합니다!")
        sys.exit(0)
